import {
    MAX_SHAPE_WEIGHT,
    MAX_TEETER_ANGLE,
    SHAPE_CIRCLE,
    SHAPE_RECTANGLE,
    SHAPE_TRIANGLE,
    TEETER_LENGTH,
    TEETER_LENGTH_SCALE,
    MAX_TEETER_MOMENT,
    SHAPE_START_POSITION_BY_X,
    SHAPE_START_POSITION_BY_Y,
    SHAPES_COLORS,
    MOVING_SHAPE_STEP,
    RIGHT_ARROW_KEY_CODE,
    LEFT_ARROW_KEY_CODE
} from "../constants/settings"

let getRandomInt = (max) => Math.ceil(Math.random() * max)

let getRandomShapeWeight =  () => getRandomInt(MAX_SHAPE_WEIGHT)

let getRandomShapeType = () => {
    let shapes = [
        SHAPE_CIRCLE,
        SHAPE_RECTANGLE,
        SHAPE_TRIANGLE
    ];

    return shapes[getRandomInt(shapes.length) - 1]
}

let getRandomShapeColor = () => SHAPES_COLORS[getRandomInt(SHAPES_COLORS.length) - 1]

let sumTotalMoment = (shapes) =>  shapes.reduce((acc,shape) =>
    acc + Math.abs(TEETER_LENGTH / 2 - shape.x) * TEETER_LENGTH_SCALE * shape.weight, 0)

export const toRadians = (angle) => angle * Math.PI / 180

export const calcTeeterAngle = (leftShapes, rightShapes) => {
    let momentsDiff = sumTotalMoment(rightShapes) - sumTotalMoment(leftShapes)

    return MAX_TEETER_ANGLE / MAX_TEETER_MOMENT * momentsDiff
}

export const getShape = (isFallen) => ({
    id: Math.random().toString(36).substring(7),
    weight: getRandomShapeWeight(),
    type: getRandomShapeType(),
    color: getRandomShapeColor(),
    x: isFallen ? SHAPE_START_POSITION_BY_X : getRandomInt(TEETER_LENGTH / 2) + TEETER_LENGTH / 2,
    y: SHAPE_START_POSITION_BY_Y
})

export const getAutopilotStepKeyCode = (leftShapes, rightShapes) => {
    let momentsDiff = sumTotalMoment(leftShapes) - sumTotalMoment(rightShapes)

    //avoid shaking
    if(Math.abs(momentsDiff) < MOVING_SHAPE_STEP * TEETER_LENGTH_SCALE * MAX_SHAPE_WEIGHT || momentsDiff === 0) {
        return 0
    }

    return momentsDiff < 0
        ? LEFT_ARROW_KEY_CODE
        : RIGHT_ARROW_KEY_CODE
}


