//为左侧组件列表每个组件都添加draggable属性 使其可被拖拽
//dragstart事件在拖拽刚开始时被触发,用于将拖拽的组件信息传递给画布
<template>
    <div>
        <div class="component-list" @dragstart="handleDragStart" v-if="this.role == 1">
            <div v-for="(item, index) in componentList" :key="index" class="list" draggable :data-index="index">
                <span class="iconfont" :class="'icon-' + item.icon" v-if="item.icon != 'tupian'"></span>
                <label for="input" class="insert" v-if="item.icon == 'tupian'">
                    <span class="iconfont" :class="'icon-' + item.icon"></span>
                    <input id="input" type="file" hidden @change="handleFileChange" />
                </label>
            </div>
        </div>
        <div v-else style="text-align: center">
            {{ this.appliedId }}:{{ this.title }}<br /><br />
            <span style="color: red; font-weight: bold" v-if="maxNumberOfAnswer > 0"
                >您已提交过 {{ this.maxNumberOfAnswer }} 次答案。
            </span>
            <span style="color: red; font-weight: bold" v-else>您暂未提交过答案</span>
            <br /><br />
            <div class="inputAndbutton"></div>
        </div>
        <div class="button-group">
            <el-button v-if="maxNumberOfAnswer > 0" type="primary" @click="showHistoryAnswer"
                >查看最近一次提交答案</el-button
            >
            <el-button v-else type="primary" disabled>查看最近一次提交答案</el-button>
            <el-button v-if="maxNumberOfAnswer > 0" type="primary" @click="handleStudentClick"
                >查看已提交答案分数</el-button
            >
            <el-button v-else type="primary" disabled>查看已提交答案的分数</el-button>
            <el-dialog title="答案列表" :visible.sync="showAnswerListDialog">
                <el-table :data="answerList" @row-click="handleAnswerClick">
                    <el-table-column prop="numberOfAnswer" label="提交答案的次数"></el-table-column>
                    <el-table-column prop="answerId" label="答案序号"></el-table-column>
                    <el-table-column prop="score" label="分数"></el-table-column>
                </el-table>
            </el-dialog>

            <el-dialog :title="'第' + clickStuNumber + '次提交的答案'" :visible.sync="showAnswerDetailDialog">
                <el-button class="return-btn" icon="el-icon-arrow-left" @click="returnToList"></el-button>
                <el-table :data="answerSteps">
                    <el-table-column prop="stepid" label="步骤"
                        ><template slot-scope="scope">
                            <span style="font-size: 16px">{{ scope.row.stepid + 1 }}</span>
                        </template></el-table-column
                    >
                    <el-table-column prop="content" label="内容"
                        ><template slot-scope="scope">
                            <span style="font-size: 16px" v-html="scope.row.content"></span> </template
                    ></el-table-column>
                </el-table>
            </el-dialog>
            <el-button type="primary" @click="viewCurrentStepAnswer">查看当前步骤答案</el-button>
            <el-button type="primary" @click="viewAllAnswers">查看该题所有答案</el-button>
            <el-dialog title="所有答案" :visible.sync="dialogVisible" width="50%">
                <div v-if="answers.length > 0">
                    <div v-for="(answer, index) in answers" :key="index">
                        <h3>第 {{ index + 1 }} 步</h3>
                        <p>{{ answer }}</p>
                    </div>
                </div>
                <div v-else>该题目暂无答案</div>
            </el-dialog>
            <el-dialog title="当前步骤的答案" :visible.sync="dialogVisible2" width="50%">
                <div v-if="answers.length > 0 && this.curComponent !== null">
                    <h3>第 {{ this.curComponent.stepId }} 步</h3>
                    <p>{{ answers[this.curComponent.stepId - 1] }}</p>
                </div>
                <div v-else>该步骤暂无答案</div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import componentList from "@/custom-component/component-list";
import axios from "axios";
import { mapState } from "vuex";
import { commonStyle, commonAttr } from "@/custom-component/component-list";
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from "@/utils/changeComponentsSizeWithScale";
import generateID from "@/utils/generateID";
import { $ } from "@/utils/utils";
export default {
    data() {
        return {
            componentList,
            dialogVisible: false,
            dialogVisible2: false,
            answers: [],
            title: localStorage.getItem("title"),
            appliedId: localStorage.getItem("appliedId"),
            maxNumberOfAnswer: localStorage.getItem("maxNumberOfAnswer"),
            stuHistoryArr: JSON.parse(localStorage.getItem("stuHistoryArr")),
            historyAnswerIndex: 0,
            showAnswerListDialog: false,
            showAnswerDetailDialog: false,
            answerList: [],
            answerSteps: [],
            clickStuName: null,
            clickStuNumber: null,
        };
    },
    computed: mapState(["stuCurStep", "curComponent", "role", "componentData", "source_id"]),
    methods: {
        returnToList() {
            this.showAnswerDetailDialog = false;
            this.showAnswerListDialog = true;
        },
        async handleStudentClick() {
            // 向后端发送请求，获取该学生提交的所有答案列表
            console.log("source_id=", this.source_id);
            const response = await fetch(
                `http://localhost:3000/api/knowledgepr/igsys_applied/checkAnswer/getAnswerList/${
                    this.source_id
                }/${Number(localStorage.getItem("appliedId"))}`
            );
            this.answerList = await response.json();
            console.log("this.answerList=", this.answerList);
            this.showAnswerListDialog = true;
        },
        async handleAnswerClick(answerRow) {
            // 向后端发送请求，获取该答案的具体步骤
            const response = await fetch(
                `http://localhost:3000/api/knowledgepr/igsys_applied/checkAnswer/getStepList/${answerRow.answerId}`
            );
            this.answerId = answerRow.answerId;
            this.answerSteps = await response.json();
            this.showAnswerListDialog = false;
            this.clickStuNumber = answerRow.numberOfAnswer;
            this.showAnswerDetailDialog = true;
        },
        handleFileChange(e) {
            console.log("e.target.files[0]=", e.target.files[0]);
            const file = e.target.files[0];
            if (!file.type.includes("image")) {
                toast("只能插入图片");
                return;
            }

            const reader = new FileReader();
            reader.onload = (res) => {
                const fileResult = res.target.result;
                const img = new Image();
                img.onload = () => {
                    const component = {
                        ...commonAttr,
                        id: generateID(),
                        component: "Picture",
                        label: "图片",
                        icon: "",
                        propValue: {
                            url: fileResult,
                            flip: {
                                horizontal: false,
                                vertical: false,
                            },
                        },
                        style: {
                            ...commonStyle,
                            top: 0,
                            left: 0,
                            width: img.width,
                            height: img.height,
                        },
                    };

                    // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
                    changeComponentSizeWithScale(component);

                    this.$store.commit("addComponent", { component });
                    this.$store.commit("recordSnapshot");

                    // 修复重复上传同一文件，@change 不触发的问题
                    $("#input").setAttribute("type", "text");
                    $("#input").setAttribute("type", "file");
                };

                img.src = fileResult;
            };

            reader.readAsDataURL(file);
        },
        showHistoryAnswer() {
            console.log("this.stuHistoryArr=", this.stuHistoryArr);
            const len = this.stuHistoryArr.length;
            this.componentData.forEach((obj) => {
                if (obj.stepId <= len && obj.icon === "wenben") {
                    obj.propValue = this.stuHistoryArr[obj.stepId - 1];
                } else if (obj.stepId <= len && obj.icon === "biaoge") {
                    obj.propValue.data = JSON.parse(this.stuHistoryArr[obj.stepId - 1]);
                }
            });
            this.$store.commit("setStepArr", this.stuHistoryArr);
        },
        handleDragStart(e) {
            // e为拖动事件
            e.dataTransfer.setData("index", e.target.dataset.index); // DataTransfer对象用于保存拖动并放下过程中的数据并传输给画布,e.target指向事件发生时的元素
            // index为组件列表里的编号，即当前拖出来的是哪类组件
            console.log("handleDragStart!");
        },
        viewCurrentStepAnswer() {
            const appliedId = Number(localStorage.getItem("appliedId"));
            axios
                .get(`http://localhost:3000/api/knowledgepr/igsys_applied/pullAnswer/${appliedId}`)
                .then((response) => {
                    console.log("你所选择答案数据为：", response.data);
                    const answerArr = response.data;
                    if (Array.isArray(answerArr)) {
                        this.answers = answerArr;
                        this.dialogVisible2 = true;
                    } else {
                        console.error("答案数据格式错误");
                        this.answers = [];
                        this.dialogVisible2 = true;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        viewAllAnswers() {
            const appliedId = Number(localStorage.getItem("appliedId"));
            axios
                .get(`http://localhost:3000/api/knowledgepr/igsys_applied/pullAnswer/${appliedId}`)
                .then((response) => {
                    console.log("你所选择答案数据为：", response.data);
                    const answerArr = response.data;
                    if (Array.isArray(answerArr)) {
                        this.answers = answerArr;
                        this.dialogVisible = true;
                    } else {
                        console.error("答案数据格式错误");
                        this.answers = [];
                        this.dialogVisible = true;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.component-list {
    height: 65%;
    padding: 10px;
    display: grid;
    grid-gap: 10px 19px;
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 40px);

    .list {
        width: 80px;
        height: 40px;
        border: 1px solid #ddd;
        cursor: grab;
        text-align: center;
        color: #333;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            cursor: grabbing;
        }

        .iconfont {
            margin-right: 4px;
            font-size: 20px;
        }

        .icon-wenben,
        .icon-biaoge {
            font-size: 18px;
        }

        .icon-tupian {
            font-size: 16px;
        }
    }
}
.button-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.inputAndbutton {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.button-group .el-button {
    margin: 10px 0;
}
</style>
