<template>
    <div v-if="shape"
         class="shape"
         :class="shape.type"
         :style="shapeStyles">
        <span>{{ shape.weight }}kg</span>
    </div>
</template>

<script>

export default {
    name: 'shape',
    props: [
        'shape'
    ],
    computed: {
        shapeWidth() {
            return 20 + (this.shape.weight * 2) + 'px';
        },
        shapeStyles() {
            if(this.shape.type !== 'triangle') {
                return {
                    'width': this.shapeWidth,
                    'height': this.shapeWidth,
                    'backgroundColor': this.shape.color,
                    'top': this.shape.y + 'px',
                    'left': this.shape.x + 'px',
                }
            }

            return {
                'border-bottom': this.shapeWidth + ' solid ' + this.shape.color,
                'border-left': this.shapeWidth + ' solid transparent',
                'border-right': this.shapeWidth + ' solid transparent',
                'line-height': this.shapeWidth,
                'top': this.shape.y + 'px',
                'left': this.shape.x + 'px',
            }
        }
    }
}
</script>

<style scoped>
.shape {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(-50%, -100%);
}
.shape span {
    font-weight: bold;
}
.circle {
    border-radius: 50%;
}
.triangle {
    width: 0;
    height: 0;
}

.triangle span {
    transform: translate(0, 60%);
}
</style>
