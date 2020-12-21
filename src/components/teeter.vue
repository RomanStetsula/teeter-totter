<template>
    <div class="teeter">
        <div class="desc"
             :style="getDescStyles">
            <shape v-for="shape in fallenShapes"
                :key="shape.id"
                :shape="shape">
            </shape>
            <shape v-for="shape in randomlyPlacedShapes"
                   :key="shape.id"
                   :shape="shape">
            </shape>
        </div>
        <div class="base"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { MAX_TEETER_ANGLE } from '../constants/settings.js';
import Shape from './shape.vue';

export default {
    name: 'teeter',
    computed: {
        ...mapGetters([
            'fallenShapes',
            'randomlyPlacedShapes',
            'teeterAngle'
        ]),
        getDescStyles() {
            return Math.abs(this.teeterAngle) >= MAX_TEETER_ANGLE
                ? { transform: `translate(0, 300px) rotate(${ -180 * Math.sign(this.teeterAngle) }deg)`}
                : { transform: `rotate(${ this.teeterAngle }deg)` }
        }
    },
    components: {
        Shape
    }
}
</script>

<style scoped>
.base {
    width: 0;
    border-bottom: 50px solid #404040;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    margin: auto;
}
.desc {
    height: 0;
    border-bottom: 10px solid #404040;
    position: relative;
    transition-duration: 1000ms
}
</style>
