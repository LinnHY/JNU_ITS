<!-- eslint-disable vue/no-v-html -->
<template>
    <div v-if="editMode == 'edit'" class="v-text" @keydown="handleKeydown" @keyup="handleKeyup">
        <!-- tabindex >= 0 使得双击时聚焦该元素 -->
        <div
            ref="text"
            :contenteditable="canEdit"
            :class="{ 'can-edit': canEdit }"
            tabindex="0"
            :style="{ verticalAlign: element.style.verticalAlign }"
            @dblclick="setEdit"
            @paste="clearStyle"
            @mousedown="handleMousedown"
            @blur="handleBlur"
            @input="handleInput"
            v-html="element.propValue"
        ></div>
    </div>
    <div v-else class="v-text preview">
        <div :style="{ verticalAlign: element.style.verticalAlign }" v-html="element.propValue"></div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { keycodes } from "@/utils/shortcutKey.js";
import request from "@/utils/request";
import OnEvent from "../common/OnEvent";
import eventBus from "@/utils/eventBus";

export default {
    extends: OnEvent,
    props: {
        propValue: {
            type: String,
            required: true,
            default: "",
        },
        request: {
            type: Object,
            default: () => {},
        },
        element: {
            type: Object,
            default: () => {},
        },
        linkage: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            canEdit: false,
            ctrlKey: 17,
            isCtrlDown: false,
            cancelRequest: null,
        };
    },
    computed: {
        ...mapState(["editMode", "curComponent", "stuCurStep", "stepArr", "role", "stuCurLogicStep", "componentData"]),
    },
    created() {
        // 注意，修改时接口属性时不会发数据，在预览时才会发
        // 如果要在修改接口属性的同时发请求，需要 watch 一下 request 的属性
        if (this.request) {
            // 第二个参数是要修改数据的父对象，第三个参数是修改数据的 key，第四个数据修改数据的类型
            this.cancelRequest = request(this.request, this.element, "propValue", "string");
        }

        eventBus.$on("componentClick", this.onComponentClick);
    },

    beforeDestroy() {
        // 组件销毁时取消请求
        this.request && this.cancelRequest();
        eventBus.$off("componentClick", this.onComponentClick);
    },
    methods: {
        onComponentClick() {
            // 如果当前点击的组件 id 和 VText 不是同一个，需要设为不允许编辑 https://github.com/woai3c/visual-drag-demo/issues/90
            if (this.curComponent.id !== this.element.id) {
                this.canEdit = false;
            }
        },
        handleInput(e) {
            this.$emit("input", this.element, e.target.innerHTML);
        },

        handleKeydown(e) {
            // 阻止冒泡，防止触发复制、粘贴组件操作
            this.canEdit && e.stopPropagation();
            if (e.keyCode == this.ctrlKey) {
                this.isCtrlDown = true;
            } else if (this.isCtrlDown && this.canEdit && keycodes.includes(e.keyCode)) {
                e.stopPropagation();
            } else if (e.keyCode == 46) {
                // deleteKey
                e.stopPropagation();
            }
        },

        handleKeyup(e) {
            // 阻止冒泡，防止触发复制、粘贴组件操作
            this.canEdit && e.stopPropagation();
            if (e.keyCode == this.ctrlKey) {
                this.isCtrlDown = false;
            }
        },

        handleMousedown(e) {
            if (this.canEdit) {
                e.stopPropagation();
            }
        },

        clearStyle(e) {
            e.preventDefault();
            const clp = e.clipboardData;
            const text = clp.getData("text/plain") || "";
            if (text !== "") {
                document.execCommand("insertText", false, text);
            }

            this.$emit("input", this.element, e.target.innerHTML);
        },
        addToStepArr(id, content) {
            console.log("加入步骤数组中...");
            this.stepArr[id] = content;
        },
        handleBlur(e) {
            const originalValue = this.element.propValue; // 保存原始值

            this.element.propValue = e.target.innerHTML || "&nbsp;";
            const html = e.target.innerHTML;
            if (html !== "") {
                this.element.propValue = e.target.innerHTML;
            } else {
                this.element.propValue = "";
                this.$nextTick(() => {
                    this.element.propValue = "&nbsp;";
                });
            }
            this.canEdit = false;
            console.log("失去焦点,this.element=", this.element);
            if (this.element.logicStepId <= this.stuCurLogicStep && this.element.propValue !== originalValue) {
                //将步骤加入步骤数组
                this.addToStepArr(this.element.stepId - 1, e.target.innerHTML);
                this.$store.commit("addstuCurStep", this.element.stepId);
                //console.log("this.element.logicStepId=", this.element.logicStepId);
                //console.log("this.stuCurLogicStep=", this.stuCurLogicStep);
                if (
                    this.element.logicStepId === this.stuCurLogicStep &&
                    this.componentData
                        .filter((item) => item.logicStepId === this.stuCurLogicStep)
                        .every((item) => this.stepArr[item.stepId - 1] !== undefined)
                ) {
                    this.$store.commit("addstuCurLogicStep");
                    this.$store.commit("releaseStepOrNot");
                }
            }
        },

        setEdit() {
            if (this.element.isLock) return;

            this.canEdit = true;
            // 全选
            this.selectText(this.$refs.text);
            // this.$refs.text是整个div组件
        },

        selectText(element) {
            const selection = window.getSelection(); // 这个对象表示用户在页面上通过鼠标或键盘操作选中的内容。
            const range = document.createRange(); // 创建一个 Range 对象，用于表示文档中的一段连续区域。
            range.selectNodeContents(element);
            //将 Range 对象的范围设置为传入的 element 的所有内容。
            //例如，如果 element 是一个 <div>，那么它会选中该 div 的所有子节点（包括文本节点）。
            selection.removeAllRanges(); // 清空当前的选区，移除所有已存在的 Range。
            selection.addRange(range); //将新的 Range 添加到当前选区，使指定内容成为选中的状态
        },

        lock() {
            this.$store.commit("lock");
        },
    },
};
</script>

<style lang="scss" scoped>
.v-text {
    width: 100%;
    height: 100%;
    display: table;

    div {
        display: table-cell;
        width: 100%;
        height: 100%;
        outline: none;
        word-break: break-all;
        padding: 4px;
    }

    .can-edit {
        cursor: text;
        height: 100%;
    }
}

.preview {
    user-select: none;
}
</style>
