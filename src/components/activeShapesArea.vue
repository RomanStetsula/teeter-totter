<template>
    <div class="area">
        <shape :shape="activeShape"></shape>
    </div>
</template>

<script>
 import { mapGetters } from 'vuex';
import Shape from './shape.vue'

export default {
    name: 'activeShapesArea',
    computed: {
        ...mapGetters([
            'activeShape'
        ]),
    },
    components: {
        Shape
    }
}
</script>

<style scoped>
.area {
    position: relative;
    height: 500px;
}
</style>
