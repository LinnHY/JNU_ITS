<template>
    <div class="edit-table">
        <table @dblclick="onDblclick">
            <tbody>
                <tr v-for="(item, row) in tableData" :key="row">
                    <td
                        v-for="(e, col) in item"
                        :key="col"
                        :class="{ selected: curTd === row + ',' + col }"
                        @click="onClick(row, col)"
                    >
                        <el-input
                            v-if="canEdit && curTd === row + ',' + col"
                            v-model="tableData[row][col]"
                            v-focus
                            @blur="onBlur"
                        ></el-input>
                        <span v-else>{{ e }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="button-grid">
            <button @click="addRow">添加新行</button>
            <button @click="addCol">添加新列</button>
            <button @click="deleteRow">删除行</button>
            <button @click="deleteCol">删除列</button>
            <el-button
                type="primary"
                @click="confirmTable"
                v-if="curComponent.stepId !== undefined && curComponent.isLock == false"
                title="填写完一个表格内容后请点击此按钮"
            >
                确认表格
            </el-button>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    directives: {
        focus: {
            // 指令的定义
            inserted(el) {
                // 聚焦元素
                el.querySelector("input").focus();
            },
        },
    },
    data() {
        return {
            curProperty: "",
            curTd: "",
            canEdit: false,
            preCurTd: "", // 失焦时 curTd 值为空，这时删除会读不到值，因此用这个变量来代替，用于删除行列
        };
    },
    computed: {
        tableData() {
            return this.$store.state.curComponent.propValue.data;
        },
        ...mapState(["curComponent", "stepArr", "stuCurLogicStep", "componentData"]),
    },
    methods: {
        onDblclick() {
            this.canEdit = true;
        },
        confirmTable() {
            console.log("将表格data加入步骤数组中...");
            this.stepArr[this.curComponent.stepId - 1] = this.curComponent.propValue.data;
            if (
                this.curComponent.logicStepId === this.stuCurLogicStep &&
                this.componentData
                    .filter((item) => item.logicStepId === this.stuCurLogicStep)
                    .every((item) => this.stepArr[item.stepId - 1] !== undefined)
            ) {
                this.$store.commit("addstuCurLogicStep");
                this.$store.commit("releaseStepOrNot");
            }
            this.$message({
                message: "该表格已成功确认！",
                type: "success",
                showClose: true, // 显示关闭按钮
            });
        },
        onClick(row, col) {
            this.curTd = row + "," + col;
            this.preCurTd = this.curTd;
        },

        onBlur() {
            this.canEdit = false;
            this.curTd = "";
        },

        deleteRow() {
            if (!this.preCurTd) {
                this.$message.error("请先选择要删除的行");
                return;
            }

            const row = this.preCurTd.split(",")[0];
            this.tableData.splice(row, 1);
        },

        addRow() {
            this.tableData.push(new Array(this.tableData[0]?.length || 1).fill(" "));
        },

        addCol() {
            if (this.tableData.length) {
                this.tableData.forEach((item) => item.push(" "));
            } else {
                this.tableData.push([" "]);
            }
        },

        deleteCol() {
            if (!this.preCurTd) {
                this.$message.error("请先选择要删除的列");
                return;
            }

            const col = this.preCurTd.split(",")[1];
            this.tableData.forEach((item) => {
                item.splice(col, 1);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.edit-table {
    overflow: auto;
    margin-bottom: 8px;

    & > div {
        margin-top: 18px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        button {
            cursor: pointer;
            background: #fff;
            border: 1px solid #dcdfe6;
            color: #606266;
            text-align: center;
            box-sizing: border-box;
            outline: 0;
            margin: 0;
            font-weight: 500;
            padding: 4px 10px;
            font-size: 14px;
            border-radius: 4px;
            margin-bottom: 10px;

            &:hover {
                background: #ecf5ff;
                color: #409eff;
            }
        }
    }

    table {
        border-collapse: collapse;
        word-break: break-all;
        word-wrap: break-word;
        text-align: center;
        font-size: 12px;

        td {
            border: 1px solid #ebeef5;
            height: 40px;
            min-width: 60px;
            max-width: 80px;
            padding: 10px;
        }
    }

    .selected {
        background: #ecf5ff;
        color: #409eff;
    }
}
.button-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: 10px;
    justify-items: center;
    align-items: center;
}

.button-grid button {
    width: 100px;
    height: 30px;
    border: none;
    border-radius: 5px;
    background-color: #f0f0f0;
}
.button-grid button:last-child {
    background-color: #409eff;
    color: #fff;
}
</style>
