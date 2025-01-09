<!-- eslint-disable max-len -->
<template>
    <div class="svg-arrow-container">
        <svg
            t="1681720530802"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2670"
            width="200"
            height="200"
        >
            <path
                d="M128 213.333333a170.666667 170.666667 0 0 1 170.666667-170.666666h42.666666v85.333333H298.666667a85.333333 85.333333 0 0 0-85.333334 85.333333v131.925334a170.666667 170.666667 0 0 1-28.672 94.634666L136.618667 512l48.042666 72.106667A170.666667 170.666667 0 0 1 213.333333 678.741333V810.666667a85.333333 85.333333 0 0 0 85.333334 85.333333h42.666666v85.333333H298.666667a170.666667 170.666667 0 0 1-170.666667-170.666666v-131.925334a85.333333 85.333333 0 0 0-14.336-47.36L34.048 512l79.616-119.424A85.333333 85.333333 0 0 0 128 345.216V213.333333z"
                fill="#505050"
                p-id="2671"
            ></path>
        </svg>
        <v-text :prop-value="element.propValue" :element="element" />
    </div>
</template>

<script>
import OnEvent from "../../common/OnEvent";

export default {
    extends: OnEvent,
    props: {
        propValue: {
            type: String,
            required: true,
            default: "",
        },
        element: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            points: "",
        };
    },
    watch: {
        "element.style.width": function () {
            this.draw();
        },
        "element.style.height": function () {
            this.draw();
        },
    },
    mounted() {
        this.draw();
    },
    methods: {
        draw() {
            const { width, height } = this.element.style;
            this.drawTriangle(width, height);
        },

        drawTriangle(width, height) {
            // 箭头四个坐标点的比例集合
            const points = [
                [0.75, 0],
                [0, 0.5],
                [1, 0.5],
                [0.75, 1],
            ];

            const coordinatePoints = points.map((point) => width * point[0] + " " + height * point[1]);
            this.points = coordinatePoints.toString();
        },
    },
};
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
