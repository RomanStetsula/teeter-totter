import Vue from 'vue'
import Vuex from 'vuex'

import {
    calcTeeterAngle,
    getShape,
    toRadians,
    getAutopilotStepKeyCode,
} from '../utils/helpers'
import {
    RIGHT_ARROW_KEY_CODE,
    LEFT_ARROW_KEY_CODE,
    MOVING_SHAPE_STEP,
    TEETER_LENGTH,
    DEFAULT_FALLING_HEIGHT,
    MAX_TEETER_ANGLE,
    INCREASE_GRAVITY_STEP
} from '../constants/settings'

Vue.use(Vuex)

let store = new Vuex.Store({
    state: {
        isPaused: false,
        activeShape: null,
        fallenShapes: [],
        randomlyPlacedShapes: [],
        teeterAngle: 0,
        gravity: 1,
        timer: null,
        autopilot: false,
        fallenAreaLeftBorder: 0,
        fallenAreaRightBorder:  TEETER_LENGTH / 2,
        score: 0
    },
    getters: {
        activeShape: ({ activeShape }) => activeShape,
        fallenShapes: ({ fallenShapes }) => fallenShapes,
        teeterAngle: ({ teeterAngle }) => teeterAngle,
        randomlyPlacedShapes: ({ randomlyPlacedShapes }) => randomlyPlacedShapes,
        timer: ({ timer }) => timer,
        autopilot: ({ autopilot }) => autopilot,
        score: ({ score }) => score
    },
    mutations: {
        setNewGame(state) {
            state.isPaused = false
            state.activeShape = null
            state.fallenShapes = []
            state.randomlyPlacedShapes = []
            state.teeterAngle = 0
            state.gravity = 1
            state.timer = null
            state.fallenAreaLeftBorder = 0
            state.fallenAreaRightBorder = TEETER_LENGTH / 2
            state.score = 0
        },
        switchAutopilot(state, autopilot) {
            state.autopilot = autopilot
        },
        setTimer(state, timer) {
            state.timer = timer
        },
        addRandomShape(state) {
            state.randomlyPlacedShapes.push(getShape(false));
        },
        setTeeterAngle(state, angle) {
            state.teeterAngle = angle
        },
        addActiveShape(state) {
            state.activeShape = getShape(true)
        },
        addActiveShapeToFallen(state) {
            state.fallenShapes.push({
                ...state.activeShape,
                y: 0,
                x: (TEETER_LENGTH / 2) - (TEETER_LENGTH / 2 - state.activeShape.x) / Math.cos(toRadians(state.teeterAngle))
            })
            state.activeShape = null;
        },
        moveActiveShapeDown: (state) => {
            state.activeShape = { ...state.activeShape, y: state.activeShape.y + state.gravity }
        },
        moveShapeHorizontally: (state, direction) => {
            state.activeShape = { ...state.activeShape, x: state.activeShape.x + MOVING_SHAPE_STEP * direction }
        },
        setFallenAreaLeftBorder: (state, leftBorder) => {
            state.fallenAreaLeftBorder = leftBorder
        },
        increaseScore: (state) => {
            state.score = state.score + 1
        }
    },
    actions: {
        runGame({ state, dispatch, commit }) {
            if(!state.activeShape) {
                dispatch('generateNextTick')
            }

            let timer = setInterval(() => {
                dispatch('addGravity')
                if(state.autopilot) {
                    dispatch('runAutopilot')
                }
            }, 16)

            commit('setTimer', timer)
        },
        runAutopilot({ state, dispatch }) {
            if (state.activeShape) {
                let keyCode =  getAutopilotStepKeyCode(
                    [ ...state.fallenShapes, state.activeShape ],
                    state.randomlyPlacedShapes)

                dispatch('moveActiveShapeHorizontally', { keyCode })
            }
        },
        moveActiveShapeHorizontally: (({ state, commit}, { keyCode })  => {
            if(!state.activeShape){
                return
            }

            if(keyCode === LEFT_ARROW_KEY_CODE && state.activeShape.x > state.fallenAreaLeftBorder) {
                commit('moveShapeHorizontally', -1)

                return
            }

            if(keyCode === RIGHT_ARROW_KEY_CODE && state.activeShape.x < state.fallenAreaRightBorder) {
                commit('moveShapeHorizontally', 1)
            }
        }),
        addGravity({ state, commit, dispatch }) {
            if (state.activeShape) {
                let distanceToFall = DEFAULT_FALLING_HEIGHT + (TEETER_LENGTH / 2 - state.activeShape.x)
                    * Math.sin(toRadians(state.teeterAngle * -1))

                if (state.activeShape.y <= distanceToFall) {
                    commit('moveActiveShapeDown')

                    return
                }

                dispatch('shapeFell')
            }
        },
        shapeFell({ commit, dispatch }) {
            commit('addActiveShapeToFallen')
            commit('increaseScore')
            dispatch('calcTeeterAngle')
        },
        calcTeeterAngle({ commit, state, dispatch }) {
            let angle = calcTeeterAngle(state.fallenShapes, state.randomlyPlacedShapes)

            if(Math.abs(angle) >= MAX_TEETER_ANGLE) {
                dispatch('endGame', angle)
                return
            }
            commit('setTeeterAngle', angle);
            dispatch('calcFallenAreaRightBorder')
            dispatch('generateNextTick')
        },
        endGame({ state, commit }, angle) {
            commit('setTeeterAngle', angle);
            clearTimeout(state.timer)
            setTimeout(() => {
                alert('Game Over. Your score: ' + state.score)
                commit('setNewGame')
            }, 2000)
        },
        calcFallenAreaRightBorder({ commit, state }){
            let leftBorder = (TEETER_LENGTH  - TEETER_LENGTH *  Math.cos(toRadians(state.teeterAngle))) / 2
            commit('setFallenAreaLeftBorder', leftBorder)
        },
        generateNextTick({ commit, state }) {
            state.gravity = state.gravity + INCREASE_GRAVITY_STEP
            commit('addRandomShape')
            commit('addActiveShape')
        },
        toggleGameExecuting({ state, dispatch, commit }) {
            if(state.timer) {
                clearTimeout(state.timer)
                commit('setTimer', null)

                return
            }
            dispatch('runGame')
        }
    }
})

export default store
