// 公共样式
/* eslint-disable */
export const commonStyle = {
    rotate: 0,
    opacity: 1,
};
export const commonAttr = {
    animations: [],
    events: {},
    groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
    isLock: false, // 是否锁定组件
    collapseName: "style", // 编辑组件时记录当前使用的是哪个折叠面板，再次回来时恢复上次打开的折叠面板，优化用户体验
    linkage: {
        duration: 0, // 过渡持续时间
        data: [
            // 组件联动
            {
                id: "", // 联动的组件 id
                label: "", // 联动的组件名称
                event: "", // 监听事件
                style: [{ key: "", value: "" }], // 监听的事件触发时，需要改变的属性
            },
        ],
    },
};

// 编辑器左侧组件列表
const list = [
    {
        component: "VText",
        label: "文字",
        propValue: "双击编辑",
        icon: "wenben",
        request: {
            method: "GET",
            data: [],
            url: "",
            series: false, // 是否定时发送请求
            time: 1000, // 定时更新时间
            paramType: "", // string object array
            requestCount: 0, // 请求次数限制，0 为无限
        },
        style: {
            width: 100,
            height: 28,
            fontSize: "20",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "",
            color: "",
        },
    },
    {
        component: "Picture",
        label: "图片",
        icon: "tupian",
        propValue: {
            url: require("@/assets/title.jpg"),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            width: 300,
            height: 200,
            borderRadius: "",
        },
    },
    {
        component: "LineShape",
        label: "直线",
        propValue: "",
        icon: "zhixian",
        style: {
            width: 100,
            height: 1,
            backgroundColor: "#000",
        },
    },
    {
        component: "VTable",
        label: "表格",
        icon: "biaoge",
        propValue: {
            data: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ],
            stripe: true,
            thBold: true,
        },
        request: {
            method: "GET",
            data: [],
            url: "",
            series: false,
            time: 1000,
            paramType: "", // string object array
            requestCount: 0, // 请求次数限制，0 为无限
        },
        style: {
            width: 600,
            height: 200,
            fontSize: "",
            fontWeight: 400,
            textAlign: "center",
            color: "",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGArrow",
        label: "箭头",
        icon: "rightArrow",
        propValue: "",
        style: {
            width: 50,
            height: 40,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGCurvedArrow",
        label: "弯曲箭头",
        icon: "xiangyouxuanzhuan",
        propValue: "",
        style: {
            width: 100,
            height: 50,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGEqual",
        label: "等于号",
        icon: "dengyu",
        propValue: "",
        style: {
            width: 30,
            height: 30,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGComma",
        label: "comma",
        icon: "comma",
        propValue: "",
        style: {
            width: 30,
            height: 30,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGSigma",
        label: "Sigma",
        icon: "sigma",
        propValue: "",
        style: {
            width: 30,
            height: 30,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGEpsilon",
        label: "Epsilon",
        icon: "epsilonsl",
        propValue: "",
        style: {
            width: 30,
            height: 30,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGLeftBrace",
        label: "LeftBrace",
        icon: "leftbrace",
        propValue: "",
        style: {
            width: 30,
            height: 30,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
    {
        component: "SVGRightBrace",
        label: "RightBrace",
        icon: "rightbrace",
        propValue: "",
        style: {
            width: 30,
            height: 30,
            fontSize: "",
            fontWeight: 400,
            lineHeight: "",
            letterSpacing: 0,
            textAlign: "center",
            color: "",
            borderColor: "black",
            backgroundColor: "rgba(255, 255, 255, 1)",
        },
    },
];

for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i];
    item.style = { ...commonStyle, ...item.style };
    list[i] = { ...commonAttr, ...item };
}

export default list;
