<!-- eslint-disable max-len -->
<template>
    <div class="svg-arrow-container">
        <svg
            t="1678683984662"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7666"
            width="200"
            height="200"
        ><path d="M768 152.917333v128h-297.984l211.968 214.016-211.968 214.016H768v128H256V750.933333l278.528-256L256 238.933333V152.917333z" fill="#000000" p-id="7667"></path></svg>
        <v-text :prop-value="element.propValue" :element="element" />
    </div>
</template>

<script>
import OnEvent from '../../common/OnEvent'

export default {
    extends: OnEvent,
    props: {
        propValue: {
            type: String,
            required: true,
            default: '',
        },
        element: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            points: '',
        }
    },
    watch: {
        'element.style.width': function () {
            this.draw()
        },
        'element.style.height': function () {
            this.draw()
        },
    },
    mounted() {
        this.draw()
    },
    methods: {
        draw() {
            const { width, height } = this.element.style
            this.drawTriangle(width, height)
        },

        drawTriangle(width, height) {
            // 箭头四个坐标点的比例集合
            const points = [
                [0.75, 0],
                [0, 0.5],
                [1, 0.5],
                [0.75, 1],
            ]

            const coordinatePoints = points.map(point => width * point[0] + ' ' + height * point[1])
            this.points = coordinatePoints.toString()
        },
    },
}
</script>

<style lang="scss" scoped>
.svg-arrow-container {
    width: 100%;
    height: 100%;

    svg {
        width: 100%;
        height: 100%;
    }

    .v-text {
        position: absolute;
        top: 72%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 40%;
    }
}
</style>
