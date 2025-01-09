<!-- eslint-disable max-len -->
<template>
    <div class="svg-curvedarrow-container">
        <svg
            t="1678200337687"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9344"
            width="200"
            height="200"
        ><path d="M31.999169 64.836221H608.000166v0.800644c195.742879 8.447993 351.998836 169.342899 351.998837 367.200437 0 197.822958-156.255958 358.752443-351.998837 367.200436v0.800644H107.584238l105.4084-105.4084c12.448554-12.448554 12.448554-32.799813 0-45.248368s-32.799813-12.448554-45.248367 0l-158.399875 158.399875c-6.431753 6.431753-9.376315 14.943585-9.184799 23.423498-0.223436 8.479913 2.753046 16.991745 9.184799 23.423498l158.399875 158.399876c12.448554 12.448554 32.799813 12.448554 45.248367 0s12.448554-32.799813 0-45.248368l-103.743273-103.711354h498.750801c1.888563 0 3.487191-0.768725 5.279996-1.087918 228.63845-11.201039 410.719838-199.551924 410.719838-430.943419C1024 194.245328 830.592555 0.837883 592.000582 0.837883c-4.319755 0-8.511832 0.51071-12.831587 0.641048-1.087919-0.127677-2.04816-0.641047-3.167998-0.641048H31.999169C14.400956 0.835224 0 15.236179 0 32.837052s14.400956 31.999169 31.999169 31.999169z" fill="" p-id="9345"></path></svg>
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
.svg-curvedarrow-container {
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
