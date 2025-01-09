import Vue from "vue";
// custom-component文件夹内为所有的自定义组件
const components = [
    "CircleShape",
    "Picture",
    "VText",
    "VButton",
    "Group",
    "RectShape",
    "LineShape",
    "VTable",
    "VChart",
];

components.forEach((key) => {
    Vue.component(key, () => import(`@/custom-component/${key}/Component`));
    Vue.component(key + "Attr", () => import(`@/custom-component/${key}/Attr`));
});

const svgs = [
    "SVGArrow",
    "SVGEqual",
    "SVGCurvedArrow",
    "SVGStar",
    "SVGTriangle",
    "SVGPhi",
    "SVGSigma",
    "SVGEpsilon",
    "SVGLeftBrace",
    "SVGRightBrace",
    "SVGComma",
];

svgs.forEach((key) => {
    Vue.component(key, () => import(`@/custom-component/svgs/${key}/Component`));
    Vue.component(key + "Attr", () => import(`@/custom-component/svgs/${key}/Attr`));
});
