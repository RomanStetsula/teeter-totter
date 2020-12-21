<template>
    <div class="menu">
        <p>
            <span @click="play" v-if="!timer">&#9658;</span>
            <span v-else @click="togglePause">&#10074;&#10074;</span>
        </p>
        <p>Score: {{ score }}</p>
        <p>
            <label for="autopilot">autopilot</label>
            <input type="checkbox" id="autopilot" v-model="auto">
        </p>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: "gameMenu",
    data() {
        return {
            auto: false
        }
    },
    methods: {
        play() {
            if(this.randomlyPlacedShapes) {
                this.togglePause()
            } else {
                this.runGame();
            }
        },
        togglePause() {
            this.toggleGameExecuting()
        },
        ...mapMutations([
            'switchAutopilot'
        ]),
        ...mapActions([
            'runGame',
            'toggleGameExecuting'
        ])
    },
    computed: {
        ...mapGetters([
            'score',
            'randomlyPlacedShapes',
            'timer',
            'autopilot'
        ])
    },
    watch: {
        auto(newVal) {
            this.switchAutopilot(newVal)
        }
    },
    created() {
        this.auto = this.autopilot;
    }
}
</script>

<style scoped>
.menu {
    background-color: aliceblue;
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
}
.menu p {
    line-height: 30px;
}
</style>
