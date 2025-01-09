<!-- eslint-disable max-len -->
<template>
    <div class="svg-arrow-container">
        <svg
            t="1678200106594"
            class="icon"
            viewBox="0 0 2559 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8881"
            width="200"
            height="200"
        ><path d="M2074.579915 17.109396l466.806081 455.54232a56.766794 56.766794 0 0 1 0.319993 83.518225c-0.127997 0-0.255995 0.127997-0.383992 0.255995l-472.565958 450.80642A61.1827 61.1827 0 0 1 1983.957841 1006.848364a56.638796 56.638796 0 0 1 0.383992-81.85426l369.592146-352.568508H59.966726C26.879429 572.425596 0 546.570145 0 514.570825s26.81543-57.918769 59.966726-57.918769h2296.335203l-366.968202-358.136389A56.638796 56.638796 0 0 1 1989.781717 16.661406a61.758688 61.758688 0 0 1 84.798198 0.44799z" fill="#2c2c2c" p-id="8882"></path></svg>
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
