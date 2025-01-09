<template>
    <div v-show="menuShow" class="contextmenu" :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
        <ul @mouseup="handleMouseUp">
            <template v-if="curComponent">
                <template v-if="!curComponent.isLock">
                    <li @click="copy">复制</li>
                    <li @click="paste">粘贴</li>
                    <li @click="cut">剪切</li>
                    <li @click="deleteComponent">删除</li>
                    <!--<li @click="lock">锁定</li>-->
                    <li @click="setTipsStep" v-if="role == 1 && this.curComponent.stepId != undefined">
                        设置该步骤的提示
                    </li>
                    <li @click="viewCurrentTip" v-if="this.curComponent.stepId != undefined">查看该步骤的提示</li>
                    <li
                        @click="setNormalStep"
                        v-if="role == 1 && (this.curComponent.icon == 'wenben' || this.curComponent.icon == 'biaoge')"
                    >
                        设为答题步骤
                    </li>
                    <li
                        ref="trigger"
                        @mouseenter="showPopover"
                        v-if="(this.curComponent.icon == 'wenben' || this.curComponent.icon == 'biaoge') && role == 1"
                    >
                        设为逻辑步
                    </li>
                    <el-popover
                        ref="popper"
                        placement="right"
                        trigger="manual"
                        v-model="popoverVisible"
                        width="120"
                        @mouseleave="hidePopover"
                    >
                        <el-button
                            @mouseleave="hidePopover"
                            @click="setLogicStep(curLogicStepId)"
                            v-if="curLogicStepId == 1"
                            >设置为逻辑步{{ curLogicStepId }}</el-button
                        >
                        <div v-else>
                            <el-button @mouseleave="hidePopover" @click="setLogicStep(curLogicStepId - 1)"
                                >设置为逻辑步{{ curLogicStepId - 1 }}</el-button
                            >
                            <el-button @mouseleave="hidePopover" @click="setLogicStep(curLogicStepId)"
                                >设置为逻辑步{{ curLogicStepId }}</el-button
                            >
                        </div>
                    </el-popover>
                </template>
                <template v-else>
                    <!--<li @click="unlock">解锁</li>-->
                    <li @click="setTipsStep" v-if="role == 1 && this.curComponent.stepId != undefined">
                        设置当前步骤的提示
                    </li>
                    <li @click="viewCurrentTip" v-if="this.curComponent.stepId != undefined">查看当前步骤的提示</li>
                </template>
            </template>
            <li v-else @click="paste">粘贴</li>
        </ul>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            copyData: null,
            popoverVisible: false,
            nowaTipsArr: [],
        };
    },
    computed: {
        ...mapState([
            "menuTop",
            "menuLeft",
            "menuShow",
            "curComponent",
            "stuCurStep",
            "componentData",
            "role",
            "stuCurLogicStep",
            "curLogicStepId",
            "tipsArr",
        ]),
    },
    methods: {
        showPopover() {
            this.popoverVisible = true;
        },
        hidePopover() {
            this.popoverVisible = false;
        },
        viewCurrentTip() {
            this.nowaTipsArr = JSON.parse(localStorage.getItem("tipsArr")) || [];
            const tip = this.nowaTipsArr[this.curComponent.stepId];
            if (tip) {
                this.$message({
                    message: `该步骤的提示为： ${tip}`,
                    type: "info",
                    showClose: true, // 显示关闭按钮
                });
            } else {
                this.$message({
                    message: "该步骤暂无提示",
                    type: "warning",
                    showClose: true, // 显示关闭按钮
                });
            }
        },
        lock() {
            this.$store.commit("lock");
        },
        setTipsStep() {
            // 弹出输入框
            this.nowaTipsArr = JSON.parse(localStorage.getItem("tipsArr"));
            const content = window.prompt("请输入提示内容：", this.nowaTipsArr[this.curComponent.stepId]);
            console.log("this.curComponent.stepId=", this.curComponent.stepId);
            if (content !== null) {
                // 用户点击了确定
                const index = this.curComponent.stepId;
                // 触发vuex中的addToTipsArr函数
                this.$store.dispatch("addToTipsArr", { content, index });
            }
        },
        unlock() {
            this.$store.commit("unlock");
        },

        // 点击菜单时不取消当前组件的选中状态
        handleMouseUp() {
            this.$store.commit("setClickComponentStatus", true);
        },

        cut() {
            this.$store.commit("cut");
        },

        copy() {
            this.$store.commit("copy");
        },

        paste() {
            this.$store.commit("paste", true);
            this.$store.commit("recordSnapshot");
        },

        deleteComponent() {
            this.$store.commit("deleteComponent");
            this.$store.commit("recordSnapshot");
        },

        upComponent() {
            this.$store.commit("upComponent");
            this.$store.commit("recordSnapshot");
        },

        downComponent() {
            this.$store.commit("downComponent");
            this.$store.commit("recordSnapshot");
        },

        topComponent() {
            this.$store.commit("topComponent");
            this.$store.commit("recordSnapshot");
        },

        bottomComponent() {
            this.$store.commit("bottomComponent");
            this.$store.commit("recordSnapshot");
        },

        setNormalStep() {
            this.$store.commit("updateComponentData");
            this.$store.commit("addStep");
        },
        setLogicStep(id) {
            this.$store.commit("updateComponentData");
            this.$store.commit("addLogicStep", id);
            if (this.curComponent.logicStepId != this.stuCurLogicStep) {
                this.$store.commit("lock");
                console.log("stuCurLogicStep", this.stuCurLogicStep);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.contextmenu {
    position: absolute;
    z-index: 1000;

    ul {
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        margin: 5px 0;
        padding: 6px 0;

        li {
            font-size: 14px;
            padding: 0 20px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;

            &:hover {
                background-color: #f5f7fa;
            }
        }
    }
}
</style>
