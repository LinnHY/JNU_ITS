import Vue from "vue";
import Vuex from "vuex";
import animation from "./animation";
import compose from "./compose";
import contextmenu from "./contextmenu";
import copy from "./copy";
import event from "./event";
import layer from "./layer";
import snapshot from "./snapshot";
import lock from "./lock";
import setStep from "./setStep";
import setTips from "./setTips";
import { getParams } from "../utils/getNameAndRole";
Vue.use(Vuex);
const { source_id, role } = getParams();
const data = {
    state: {
        // state用于存储数据
        ...animation.state,
        ...compose.state,
        ...contextmenu.state,
        ...copy.state,
        ...event.state,
        ...layer.state,
        ...snapshot.state,
        ...lock.state,
        ...setStep.state,
        ...setTips.state,
        source_id: Number(source_id),
        role: Number(role),
        maxNumberOfAnswer: 1,
        stuHistoryArr: [],
        editMode: "edit", // 编辑器模式 edit preview
        stuCurStep: 1,
        stuCurLogicStep: 1,
        stepArr: [],
        tmpres: [],
        allnodes: [],
        canvasStyleData: {
            // 页面全局数据
            width: 1200,
            height: 740,
            scale: 100,
            color: "#000",
            opacity: 1,
            background: "#fff",
            fontSize: 14,
        },
        isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
        componentData: [], // 画布组件数据
        curComponent: null,
        curComponentIndex: null,
        // 点击画布时是否点中组件，主要用于取消选中组件用。
        // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
        isClickComponent: false,
        relatedKps: localStorage.getItem("relatedKps") === null ? [] : localStorage.getItem("relatedKps").split(","),
    },
    mutations: {
        // mutations用于操纵state中的数据
        ...animation.mutations,
        ...compose.mutations,
        ...contextmenu.mutations,
        ...copy.mutations,
        ...event.mutations,
        ...layer.mutations,
        ...snapshot.mutations,
        ...lock.mutations,
        ...setStep.mutations,
        ...setTips.mutations,
        aceSetCanvasData(state, value) {
            state.canvasStyleData = value;
        },
        setAllNodes(state, nodes) {
            state.allnodes = nodes;
        },
        setstuHistoryArr(state, stuHistoryArr) {
            state.stuHistoryArr = stuHistoryArr;
        },
        setmaxNumberOfAnswer(state, maxNumberOfAnswer) {
            state.maxNumberOfAnswer = maxNumberOfAnswer;
        },
        CLEAR_STEPS(state) {
            state.componentData.forEach((item) => {
                if (item.stepId !== undefined) {
                    delete item.stepId;
                }
                if (item.logicStepId !== undefined) {
                    delete item.logicStepId;
                }
                if (item.isLock !== undefined) {
                    item.isLock = false;
                }
            });
            state.curStepId = 1;
            state.curLogicStepId = 1;
        },
        clearStepArr(state) {
            console.log("正在清空stepArr数组...");
            state.stepArr = [];
        },
        setStepArr(state, stuHistoryArr) {
            console.log("正在设置stepArr数组为stuHistoryArr...");
            state.stepArr = stuHistoryArr;
        },
        clearTipsArr(state) {
            console.log("正在清空tipsArr数组...");
            state.tipsArr = [];
        },
        updateComponentData(state) {
            state.componentData.push({});
            state.componentData.pop();
        },
        updateTmpres(state, newVal) {
            state.tmpres = newVal;
        },
        setRelatedKps(state, relatedKps) {
            state.relatedKps = relatedKps;
            localStorage.setItem("relatedKps", JSON.stringify(relatedKps));
        },
        //??????
        setStuCurStepTo1(state) {
            state.stuCurStep = 1;
        },
        setStuCurLogicStepTo1(state) {
            state.stuCurLogicStep = 1;
        },
        setcurStepIdTo1(state) {
            state.curStepId = 1;
        },
        setCurapplyId(state, value) {
            console.log("已进入setCurapplyId");
            state.curapplyId = value;
        },
        aceSetcurComponent(state, value) {
            for (let i = 0; i < state.componentData.length; i++) {
                if (state.componentData[i].id === value.id) {
                    state.componentData.splice(i, 1);
                }
            }
            state.componentData.push(value);
            state.curComponent = value;
        },

        setClickComponentStatus(state, status) {
            state.isClickComponent = status;
        },

        setEditMode(state, mode) {
            state.editMode = mode;
        },

        setInEditorStatus(state, status) {
            state.isInEdiotr = status;
        },

        setCanvasStyle(state, style) {
            state.canvasStyleData = style;
        },

        setCurComponent(state, { component, index }) {
            state.curComponent = component;
            state.curComponentIndex = index;
        },

        setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
            if (top) curComponent.style.top = Math.round(top);
            if (left) curComponent.style.left = Math.round(left);
            if (width) curComponent.style.width = Math.round(width);
            if (height) curComponent.style.height = Math.round(height);
            if (rotate) curComponent.style.rotate = Math.round(rotate);
        },

        setShapeSingleStyle({ curComponent }, { key, value }) {
            curComponent.style[key] = value;
        },

        setComponentData(state, componentData = []) {
            Vue.set(state, "componentData", componentData);
        },

        addComponent(state, { component, index }) {
            if (index !== undefined) {
                state.componentData.splice(index, 0, component);
            } else {
                state.componentData.push(component);
            }
        },

        deleteComponent(state, index) {
            if (index === undefined) {
                index = state.curComponentIndex;
            }

            if (index == state.curComponentIndex) {
                state.curComponentIndex = null;
                state.curComponent = null;
            }

            if (/\d/.test(index)) {
                state.componentData.splice(index, 1);
            }
        },
    },
    actions: {
        ...setTips.actions,
        updateRelatedKps({ commit }, relatedKps) {
            commit("setRelatedKps", relatedKps);
        },
    },
};

export default new Vuex.Store(data);
