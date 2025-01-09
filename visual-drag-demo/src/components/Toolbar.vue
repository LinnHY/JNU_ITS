<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
    <div>
        <div class="toolbar">
            <el-button @click="undo">撤消</el-button>
            <!--<label for="input" class="insert">
                插入图片
                <input id="input" type="file" hidden @change="handleFileChange" />
            </label>
            <el-button @click="save">暂存至localStorage</el-button>-->
            <el-button style="margin-left: 10px" @click="preview(false)">预览</el-button>
            <el-button @click="clearCanvas">清空画布</el-button>
            <el-button :disabled="!areaData.components.length" @click="compose">组合</el-button>
            <el-button
                :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
                @click="decompose"
            >
                拆分
            </el-button>

            <!--<el-button :disabled="!curComponent || curComponent.isLock" @click="lock">锁定</el-button>
            <el-button :disabled="!curComponent || !curComponent.isLock" @click="unlock">解锁</el-button>-->
            <el-button @click="preview(true)">截图</el-button>

            <el-popover
                placement="bottom"
                title="使用提示"
                width="500"
                trigger="click"
                content="①  点击截图前请按住ctrl键并上下滑动鼠标滚轮调整页面缩放比例，确保点击预览时画布右侧与下侧的滚动条消失！
                         ②  若需要输入特殊符号，请同时按下键盘上的win键和.键，以调出特殊符号键盘，部分特殊符号已在左侧组件栏中！"
            >
                <el-button slot="reference" style="margin-left: 10px">使用提示</el-button>
            </el-popover>
            <el-button @click="clearSteps" style="margin-left: 10px; background-color: orange" v-if="this.role == 1"
                >清空步骤信息</el-button
            >
            <el-button type="primary" @click="showStepList" style="margin-left: 10px">显示步骤列表</el-button>
            <el-dialog title="步骤列表" :visible.sync="dialogVisible2" width="30%">
                <step-list></step-list>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">关闭</el-button>
                </span>
            </el-dialog>
            <el-button
                type="primary"
                style="margin-left: 10px"
                @click="
                    showForm = true;
                    getKnowledgePoints();
                "
                v-if="this.role == 1"
                >提交新题目</el-button
            >
            <el-dialog
                title="添加题目"
                :visible.sync="showForm"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="70%"
            >
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="标题" required>
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="难度系数" required>
                        <el-input-number v-model="form.difficulty" :min="1" :max="10" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="关联知识点">
                        <el-checkbox-group v-model="form.selectedPoints">
                            <el-row>
                                <el-col v-for="point in knowledgePoints" :key="point.name" :span="7">
                                    <el-checkbox :label="point.id">{{ point.name }}</el-checkbox>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showForm = false">取消</el-button>
                    <el-button
                        type="primary"
                        @click="submitForm"
                        :disabled="!form.selectedPoints.length || form.title === ''"
                        >确定</el-button
                    >
                </div>
            </el-dialog>
            <el-button type="primary" style="margin-left: 10px" @click="updateTitle" v-if="this.role == 1"
                >修改旧题目</el-button
            >
            <el-dialog
                title="修改旧题目"
                :visible.sync="showForm2"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="70%"
            >
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="更新标题" required>
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="更新系数" required>
                        <el-input-number v-model="form.difficulty" :min="1" :max="10" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="更新知识点">
                        <el-checkbox-group v-model="form.selectedPoints">
                            <el-row>
                                <el-col v-for="point in knowledgePoints" :key="point.name" :span="7">
                                    <el-checkbox :label="point.id">{{ point.name }}</el-checkbox>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showForm2 = false">取消</el-button>
                    <el-button
                        type="primary"
                        @click="modifyForm"
                        :disabled="!form.selectedPoints.length || form.title === ''"
                        >确定</el-button
                    >
                </div>
            </el-dialog>
            <el-button
                type="primary"
                @click="
                    getIdList();
                    showIdListDialog_delete = true;
                "
                style="margin-left: 10px"
                v-if="this.role == 1"
                >删除旧题目</el-button
            >
            <el-dialog title="请选择要删除的题目" :visible.sync="showIdListDialog_delete">
                <el-table
                    :data="knowledgePoints.filter((kp) => applied_belong_kid[kp.id] !== undefined)"
                    @row-click="handleRowClick"
                >
                    <el-table-column prop="name" label="知识点"></el-table-column>
                    <el-table-column label="相关题目">
                        <template slot-scope="scope">
                            <span v-if="applied_belong_kid[scope.row.id] != undefined">
                                <el-collapse v-model="expandedRowKeys">
                                    <el-collapse-item
                                        v-for="(item, index) in applied_belong_kid[scope.row.id]"
                                        :key="index"
                                        :title="idList.find((obj) => obj.id === item).title"
                                    >
                                        <el-radio-group v-model="selectedTitle" size="small">
                                            <el-radio :label="item">{{
                                                idList.find((obj) => obj.id === item).title
                                            }}</el-radio>
                                        </el-radio-group>
                                    </el-collapse-item>
                                </el-collapse>
                            </span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer">
                    <el-button @click="showIdListDialog_delete = false">取消</el-button>
                    <el-button type="primary" @click="showConfirmDeleteDialog = true">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="确认删除"
                :visible.sync="showConfirmDeleteDialog"
                :close-on-click-modal="false"
                :show-close="false"
            >
                这将删除所有与该题目相关的答案和提示等数据，是否确定删除？
                <div slot="footer">
                    <el-button @click="showConfirmDeleteDialog = false">取消</el-button>
                    <el-button type="primary" @click="confirmDeleteIdSelection()">确定</el-button>
                </div>
            </el-dialog>
            <el-button
                type="primary"
                @click="
                    getIdList();
                    showIdListDialog = true;
                "
                style="margin-left: 10px"
                >选择题目</el-button
            >
            <el-dialog title="请选择题目" :visible.sync="showIdListDialog" :before-close="beforeCloseIdListDialog">
                <el-table
                    :data="knowledgePoints.filter((kp) => applied_belong_kid[kp.id] !== undefined)"
                    @row-click="handleRowClick"
                >
                    <el-table-column prop="name" label="知识点"></el-table-column>
                    <el-table-column label="相关题目">
                        <template slot-scope="scope">
                            <span v-if="applied_belong_kid[scope.row.id] != undefined">
                                <el-collapse v-model="expandedRowKeys">
                                    <el-collapse-item
                                        v-for="(item, index) in applied_belong_kid[scope.row.id]"
                                        :key="index"
                                        :title="idList.find((obj) => obj.id === item).title"
                                    >
                                        <el-radio-group v-model="selectedTitle" size="small">
                                            <el-radio :label="item">{{
                                                idList.find((obj) => obj.id === item).title
                                            }}</el-radio>
                                        </el-radio-group>
                                    </el-collapse-item>
                                </el-collapse>
                            </span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer">
                    <el-button @click="showIdListDialog = false">取消</el-button>
                    <el-button type="primary" @click="confirmIdSelection0">确定</el-button>
                </div>
            </el-dialog>

            <el-button
                type="primary"
                @click="
                    showIdListDialog2 = true;
                    getIdList();
                "
                style="margin-left: 10px"
                >提交答案</el-button
            >
            <el-dialog
                title="您即将提交的步骤列表"
                :visible.sync="showIdListDialog2"
                :before-close="beforeCloseIdListDialog"
            >
                <div>
                    <el-table
                        :data="
                            stepArr.map((item, index) => ({
                                value: item === undefined ? '空' : item,
                                index: index + 1,
                            }))
                        "
                    >
                        <el-table-column label="序号" prop="index"></el-table-column>
                        <el-table-column label="内容"
                            ><template slot-scope="scope"> <div v-html="scope.row.value"></div> </template
                        ></el-table-column>
                    </el-table>
                </div>
                <div slot="footer">
                    <el-button @click="showIdListDialog2 = false">取消</el-button>
                    <el-button type="primary" @click="checkMaxNumberOfAnswer">确定</el-button>
                </div>
            </el-dialog>
            <el-button @click="getStudentList" style="margin-left: 10px" type="primary" v-if="this.role == 1"
                >查看学生答案</el-button
            >

            <el-dialog title="学生列表" :visible.sync="showStudentListDialog">
                <el-table :data="studentList" @row-click="handleStudentClick">
                    <el-table-column prop="stuId" label="学生id"></el-table-column>
                    <el-table-column prop="stuName" label="学生用户名"></el-table-column>
                </el-table>
            </el-dialog>

            <el-dialog title="答案列表" :visible.sync="showAnswerListDialog">
                <el-button class="return-btn" icon="el-icon-arrow-left" @click="returnToStudentList"></el-button>
                <el-table :data="answerList" @row-click="handleAnswerClick">
                    <el-table-column prop="numberOfAnswer" label="提交答案的次数"></el-table-column>
                    <el-table-column prop="answerId" label="答案序号"></el-table-column>
                    <el-table-column prop="score" label="分数"></el-table-column>
                </el-table>
            </el-dialog>

            <el-dialog
                :title="'学生' + clickStuName + '对该题的第' + clickStuNumber + '次提交的答案'"
                :visible.sync="showAnswerDetailDialog"
            >
                <el-button class="return-btn" icon="el-icon-arrow-left" @click="returnToAnswerList"></el-button>
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
                <el-form label-width="80px" style="margin-top: 20px">
                    <el-form-item label="分数">
                        <el-input-number v-model="score" :min="0" :max="100" :controls="true"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="confirmScore">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-button type="primary" @click="redirectToResource" style="margin-left: 10px">学习资源页</el-button>
            <div class="canvas-config">
                <span>画布大小</span>
                <input v-model="canvasStyleData.width" />
                <span>*</span>
                <input v-model="canvasStyleData.height" />
            </div>
            <div class="canvas-config">
                <span>画布比例</span>
                <input v-model="scale" @input="handleScaleChange" /> %
            </div>
        </div>

        <!-- 预览 -->
        <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
        <AceEditor v-if="isShowAceEditor" @closeEditor="closeEditor" />
    </div>
</template>

<script>
import generateID from "@/utils/generateID";
import StepList from "@/components/showStepList.vue";
import toast from "@/utils/toast";
import { mapState } from "vuex";
import Preview from "@/components/Editor/Preview";
import AceEditor from "@/components/Editor/AceEditor.vue";
import { commonStyle, commonAttr } from "@/custom-component/component-list";
import eventBus from "@/utils/eventBus";
import { $ } from "@/utils/utils";
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from "@/utils/changeComponentsSizeWithScale";
import axios from "axios";
export default {
    components: { Preview, AceEditor, StepList },
    data() {
        return {
            titles: [],
            isShowPreview: false,
            isShowAceEditor: false,
            timer: null,
            isScreenshot: false,
            scale: 100,
            showForm: false,
            showForm2: false,
            score: 0,
            answerId: 0,
            form: {
                title: "",
                difficulty: 1,
                selectedPoints: [36],
            },
            knowledgePoints: [],
            showIdListDialog2: false,
            showIdListDialog: false,
            showIdListDialog_delete: false,
            showConfirmDeleteDialog: false,
            idList: this.idList,
            relatedApplieds: [],
            selectedId: null,
            expandedRowKeys: [],
            selectedTitle: "",
            dialogVisible: false,
            dialogVisible2: false,
            applied_belong_kid: [],
            maxNumberOfAnswer: localStorage.getItem("maxNumberOfAnswer"),
            showStudentListDialog: false,
            showAnswerListDialog: false,
            showAnswerDetailDialog: false,
            studentList: [],
            answerList: [],
            answerSteps: [],
            clickStuName: null,
            clickStuNumber: null,
        };
    },
    computed: {
        ...mapState([
            "componentData",
            "canvasStyleData",
            "areaData",
            "curComponent",
            "curComponentIndex",
            "curapplyId",
            "role",
            "stepArr",
            "tipsArr",
        ]),
    },

    created() {
        eventBus.$on("preview", this.preview);
        eventBus.$on("save", this.save);
        eventBus.$on("clearCanvas", this.clearCanvas);

        this.scale = this.canvasStyleData.scale;
    },

    mounted() {
        this.getIdList();
        this.getKnowledgePoints();
    },
    methods: {
        returnToStudentList() {
            this.showAnswerListDialog = false;
            this.showStudentListDialog = true;
        },
        returnToAnswerList() {
            this.showAnswerDetailDialog = false;
            this.showAnswerListDialog = true;
        },
        confirmScore() {
            console.log("确认分数：", this.score);
            axios
                .post(`http://localhost:3000/api/knowledgepr/igsys_applied/judgeAnswer`, {
                    score: this.score,
                    answerId: this.answerId,
                })
                .then(() => {
                    this.$message({
                        message: "评分成功！",
                        type: "success",
                        showClose: true, // 显示关闭按钮
                    });
                    this.showAnswerDetailDialog = false;
                    this.showStudentListDialog = true;
                })
                .catch((error) => {
                    console.log(error);
                    this.$message.warning("评分失败！");
                });
        },
        async getStudentList() {
            // 向后端发送请求，获取做过该题目的学生列表
            const response = await fetch(
                `http://localhost:3000/api/knowledgepr/igsys_applied/checkAnswer/getStudentList/${Number(
                    localStorage.getItem("appliedId")
                )}`
            );
            this.studentList = await response.json();
            console.log("this.studentList=", this.studentList);

            this.showStudentListDialog = true;
        },
        async handleStudentClick(student) {
            // 向后端发送请求，获取该学生提交的所有答案列表
            console.log("student", student);
            const response = await fetch(
                `http://localhost:3000/api/knowledgepr/igsys_applied/checkAnswer/getAnswerList/${
                    student.stuId
                }/${Number(localStorage.getItem("appliedId"))}`
            );
            this.answerList = await response.json();
            console.log("this.answerList=", this.answerList);
            this.showStudentListDialog = false;
            this.clickStuName = student.stuName;
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
        checkMaxNumberOfAnswer() {
            if (this.maxNumberOfAnswer === 0) {
                this.confirmIdSubmit();
            } else {
                this.$confirm("你更改了答案，是否提交新答案？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.confirmIdSubmit();
                    })
                    .catch(() => {
                        // 用户选择取消，不执行任何操作
                    });
            }
        },
        showStepList() {
            this.dialogVisible2 = true;
        },
        confirmDeleteIdSelection() {
            console.log("您要删除的题目是：", this.selectedTitle);
            if (this.selectedTitle) {
                axios
                    .get(`http://localhost:3000/api/knowledgepr/igsys_applied/deleteApplied/${this.selectedTitle}`)
                    .then((response) => {
                        this.$message({
                            message: "题目已成功删除！",
                            type: "success",
                            showClose: true, // 显示关闭按钮
                        });
                        this.showConfirmDeleteDialog = false;
                        this.showIdListDialog_delete = false;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                this.$message.warning("每次只能选择一个题目！");
            }
        },
        updateTitle() {
            this.form.title = localStorage.getItem("title");
            this.form.difficulty = localStorage.getItem("difficulty");
            this.form.selectedPoints = localStorage.getItem("relatedKps").split(",").map(Number);
            console.log("this.form=", this.form);
            this.showForm2 = true;
        },
        clearSteps() {
            this.$store.commit("CLEAR_STEPS");
            this.$store.commit("updateComponentData");
        },
        beforeCloseChapterDialog(done) {
            if (this.showTitleDialog) {
                this.showTitleDialog = false;
            }
            done();
        },
        beforeCloseTitleDialog(done) {
            done();
        },
        handleChapterClick(row) {
            this.selectedChapterId = row.id;
            this.showTitleDialog = true;
            this.getTitlesByChapterId();
        },
        handleTitleClick(row) {
            // 处理选中的题目
            console.log("选中了题目：", row.title);
            this.showTitleDialog = false;
        },
        handleRowClick(row, event, column) {
            console.log("row=", row);
            console.log("expandedRowKeys=", this.expandedRowKeys);
            if (this.expandedRowKeys.includes(row.name)) {
                const index = this.expandedRowKeys.indexOf(row.name);
                this.expandedRowKeys.splice(index, 1);
            } else {
                this.expandedRowKeys.push(row.name);
            }
        },
        confirmIdSelection0() {
            console.log("this.selectedTitle=", this.selectedTitle);
            const selectedItem = this.selectedTitle;
            if (selectedItem) {
                this.selectedId = selectedItem;
                this.findLatestAnswer(() => {
                    this.confirmIdSelection();
                });
            } else {
                this.$message.error("请选择一个题目");
            }
        },
        beforeCloseIdListDialog(done) {
            if (this.selectedId) {
                done();
            } else {
                this.$message.error("请选择一个题目");
            }
        },
        redirectToResource() {
            window.location.href = "http://1.12.235.165/resource";
        },
        handleScaleChange() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                // 画布比例设一个最小值，不能为 0
                // eslint-disable-next-line no-bitwise
                this.scale = ~~this.scale || 1;
                changeComponentsSizeWithScale(this.scale);
            }, 1000);
        },

        handleAceEditorChange() {
            this.isShowAceEditor = !this.isShowAceEditor;
        },

        closeEditor() {
            this.handleAceEditorChange();
        },

        lock() {
            this.$store.commit("lock");
        },

        unlock() {
            this.$store.commit("unlock");
        },

        compose() {
            this.$store.commit("compose");
            this.$store.commit("recordSnapshot");
        },

        decompose() {
            this.$store.commit("decompose");
            this.$store.commit("recordSnapshot");
        },

        undo() {
            this.$store.commit("undo");
        },

        redo() {
            this.$store.commit("redo");
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

        preview(isScreenshot) {
            this.isScreenshot = isScreenshot;
            this.isShowPreview = true;
            this.$store.commit("setEditMode", "preview");
        },

        save() {
            localStorage.setItem("canvasData", JSON.stringify(this.componentData)); // 保存组件数组至localStorage
            console.log("componentData = " + JSON.stringify(this.componentData));
            console.log("canvasStyleData = " + JSON.stringify(this.canvasStyleData)); // 保存画布属性至localStorage
            localStorage.setItem("canvasStyle", JSON.stringify(this.canvasStyleData));
            this.$message({
                message: "保存成功",
                type: "success",
                showClose: true, // 显示关闭按钮
            });
        },

        clearCanvas() {
            this.$store.commit("setCurComponent", { component: null, index: null });
            this.$store.commit("setComponentData", []);
            this.$store.commit("recordSnapshot");
            this.$store.commit("clearStepArr");
            this.$store.commit("clearTipsArr");
            this.$store.commit("setStuCurStepTo1");
            this.$store.commit("setStuCurLogicStepTo1");
            this.$store.commit("setcurStepIdTo1");
        },

        handlePreviewChange() {
            this.isShowPreview = false;
            this.$store.commit("setEditMode", "edit");
        },

        submitForm() {
            const selectedPoints = this.form.selectedPoints;
            console.log("selectedPoints=", selectedPoints);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 将数据提交到后端保存
                    this.$axios
                        .post("http://localhost:3000/api/knowledgepr/igsys_applied/pushApplied", {
                            title: this.form.title,
                            difficulty: this.form.difficulty,
                            componentData: JSON.stringify(this.componentData),
                            canvasStyleData: JSON.stringify(this.canvasStyleData),
                            selectedPoints: selectedPoints,
                            tipsArr: JSON.stringify(this.tipsArr),
                        })
                        .then(() => {
                            this.$message({
                                message: "题目已成功添加！",
                                type: "success",
                                showClose: true, // 显示关闭按钮
                            });
                            this.showForm = false;
                        })
                        .catch((err) => {
                            this.$message.warning(err);
                        });
                } else {
                    return false;
                }
            });
        },
        modifyForm() {
            const selectedPoints = this.form.selectedPoints;
            console.log("selectedPoints222=", selectedPoints);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 将数据提交到后端保存
                    this.$axios
                        .post("http://localhost:3000/api/knowledgepr/igsys_applied/pushApplied/modify", {
                            title: this.form.title,
                            id: Number(localStorage.getItem("appliedId")),
                            difficulty: this.form.difficulty,
                            componentData: JSON.stringify(this.componentData),
                            canvasStyleData: JSON.stringify(this.canvasStyleData),
                            selectedPoints: selectedPoints,
                            tipsArr: JSON.stringify(this.tipsArr),
                        })
                        .then(() => {
                            this.$message({
                                message: "题目已成功修改！",
                                type: "success",
                                showClose: true, // 显示关闭按钮
                            });
                            this.showForm2 = false;
                        })
                        .catch((err) => {
                            this.$message.warning(err);
                        });
                } else {
                    return false;
                }
            });
        },
        getKnowledgePoints() {
            axios
                .get("http://localhost:3000/api/knowledgepr/igsys_applied/pullRelation/kps")
                .then((response) => {
                    console.log("kps=", response.data);
                    this.knowledgePoints = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getIdList() {
            axios
                .get("http://localhost:3000/api/knowledgepr/igsys_applied/pullApplied/ids")
                .then((response) => {
                    console.log(response.data);
                    this.idList = response.data.map((item) => ({
                        id: item.id,
                        title: item.title,
                        difficulty: item.difficulty,
                        relatedKps: item.relatedKps,
                    }));
                    console.log("this.idList=", this.idList);
                    this.idList.forEach((item) => {
                        item.relatedKps.forEach((item2) => {
                            if (this.applied_belong_kid[item2] != null) {
                                if (!this.applied_belong_kid[item2].includes(item.id))
                                    this.applied_belong_kid[item2].push(item.id);
                            } else this.applied_belong_kid[item2] = [item.id];
                        });
                    });
                    console.log("idList=", this.idList);
                    console.log("applied_belong_kid=", this.applied_belong_kid);
                })
                .catch((error) => {
                    console.log("applied_belong_kid=", this.applied_belong_kid);
                    this.$message.warning(error);
                });
        },
        // 关闭题目列表对话框前执行的函数
        beforeCloseIdListDialog(done) {
            this.selectedId = null;
            done();
        },
        // 处理表格行选中事件
        handleSelectionChange(selection) {
            if (selection.length === 1) {
                this.selectedId = selection[0].id;
            } else {
                this.selectedId = null;
            }
        },
        findLatestAnswer(callback) {
            if (this.selectedId) {
                axios
                    .get(
                        `http://localhost:3000/api/knowledgepr/igsys_applied/pullApplied/getNumberOfAnswer/${this.selectedId}/${this.$store.state.source_id}`
                    )
                    .then((response) => {
                        const { maxNumberOfAnswer, stuHistoryArr } = response.data;
                        console.log("maxNumberOfAnswer=", maxNumberOfAnswer, "stuHistoryArr=", stuHistoryArr);
                        localStorage.setItem("maxNumberOfAnswer", maxNumberOfAnswer);
                        localStorage.setItem("stuHistoryArr", JSON.stringify(stuHistoryArr));
                        callback();
                    })
                    .catch((error) => {
                        console.log("发生错误！", error);
                    });
            }
        },
        // 确认题目选择
        confirmIdSelection() {
            if (this.selectedId) {
                axios
                    .get(`http://localhost:3000/api/knowledgepr/igsys_applied/pullApplied/${this.selectedId}`)
                    .then((response) => {
                        console.log("你所选择的题目的画布数据为：", response.data);
                        const { componentData, canvasStyleData, relatedKps, tipsArr, title, difficulty } =
                            response.data;
                        localStorage.setItem("canvasData", componentData.replace(/\\"/g, '"').slice(1, -1));
                        localStorage.setItem("canvasStyle", canvasStyleData.replace(/\\"/g, '"').slice(1, -1));
                        localStorage.setItem("relatedKps", relatedKps);
                        localStorage.setItem("title", title);
                        localStorage.setItem("difficulty", difficulty);
                        localStorage.setItem("appliedId", this.selectedId);
                        localStorage.setItem("tipsArr", JSON.parse(tipsArr));
                        location.reload();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                this.$message.warning("每次只能选择一个题目！");
            }
        },
        //确认提交某道题的答案
        confirmIdSubmit() {
            this.selectedId = Number(localStorage.getItem("appliedId"));
            console.log("this.selectedId=", this.selectedId);
            if (this.selectedId) {
                console.log("我想提交到this.selectedId=", this.selectedId);
                axios
                    .post(`http://localhost:3000/api/knowledgepr/igsys_applied/pushAnswer`, {
                        appliedId: this.selectedId,
                        stepArr: this.$store.state.stepArr,
                        source_id: this.$store.state.source_id,
                        role: this.$store.state.role,
                    })
                    .then((response) => {
                        this.$message({
                            message: "答案已成功提交！",
                            type: "success",
                            showClose: true, // 显示关闭按钮
                        });
                        this.showIdListDialog2 = false;
                        this.findLatestAnswer(() => {
                            this.confirmIdSelection();
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        this.$message.warning("答案提交失败！");
                    });
            } else {
                this.$message.warning("请选择一个题目再进行提交！");
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.toolbar {
    padding: 15px 10px;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1px solid #ddd;

    .canvas-config {
        display: inline-block;
        margin-left: 10px;
        font-size: 14px;
        color: #606266;

        input {
            width: 50px;
            margin-left: 4px;
            outline: none;
            padding: 0 5px;
            border: 1px solid #ddd;
            color: #606266;
        }

        span {
            margin-left: 10px;
        }
    }

    .insert {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: 0.1s;
        font-weight: 500;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        margin-left: 10px;

        &:active {
            color: #3a8ee6;
            border-color: #3a8ee6;
            outline: 0;
        }

        &:hover {
            background-color: #ecf5ff;
            color: #3a8ee6;
        }
    }
}

.inline-block {
    display: inline-block;
}
</style>
