<template>
    <div class="attr-container">
        <p class="title">画布属性</p>
        <barGraph />
        <div class="button-group">
            <!--<el-button type="primary" @click="viewCurrentStepAnswer">查看当前步骤答案</el-button>
            <el-button type="primary" @click="viewAllAnswers">查看该题所有答案</el-button>
            <el-button type="primary" @click="viewCurrentStepTips">查看当前步骤提示</el-button>-->
            <el-button type="primary" @click="loadGraph">显示相关知识点图谱</el-button>
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
                <div v-if="answers.length > 0">
                    <h3>第 {{ this.stuCurStep }} 步</h3>
                    <p>{{ answers[this.stuCurStep - 1] }}</p>
                </div>
                <div v-else>该步骤暂无答案</div>
            </el-dialog>
            <!--<el-dialog title="步骤提示" :visible.sync="dialogVisible3" width="50%">
                <div v-if="tipsArr[this.stuCurStep]">
                    <h3>该题第 {{ this.stuCurStep }} 步的提示为</h3>
                    <p>{{ tipsArr[this.stuCurStep] }}</p>
                </div>
                <div v-else>该步骤暂无提示</div>
            </el-dialog>-->
        </div>
        <graph :nodes="nodes" :edges="edges" :urls="urls" ref="network" style="height: 350px" />
    </div>
</template>

<script>
import { mapState } from "vuex";
import barGraph from "./barGraph";
import graph from "./graph.vue";
import axios from "axios";
import { Network, vis } from "vis";
export default {
    data() {
        return {
            options: {
                color: "颜色",
                opacity: "不透明度",
                backgroundColor: "背景色",
                fontSize: "字体大小",
            },
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3: false,
            answers: [],
            tipsArr: [],
            nodes: [],
            edges: [],
            urls: [],
        };
    },
    computed: mapState(["canvasStyleData", "stuCurStep", "relatedKps", "tmpres", "allnodes"]),
    methods: {
        isIncludesColor(str) {
            return str.toLowerCase().includes("color");
        },
        clearNodes() {
            this.nodes = [{ id: 1, label: "1" }];
            console.log(this.$refs.network);
            this.$refs.network.drawGraph();
            this.$refs.network.drawGraph();
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
        viewCurrentStepTips() {
            this.tipsArr = JSON.parse(localStorage.getItem("tipsArr")) || [];
            //console.log("this.tipsArr=", this.tipsArr);
            this.dialogVisible3 = true;
        },
        async loadGraph() {
            const relatedKps = this.relatedKps.map((kid) => parseInt(kid)); // 转换成数字数组
            //console.log("relatedKps=", relatedKps);

            // 查询数据库获取节点信息
            const nodesData = await this.fetchNodesData(relatedKps);
            //console.log("nodesData=", nodesData);

            // 构建节点和边数组
            this.nodes = nodesData.map(({ kid, knowledge_name }) => ({
                id: kid,
                label: knowledge_name,
            }));
            console.log("this.nodes=", this.nodes);
            // 获取nodes数组中所有对象的id值组成的数组
            const allnodes = this.nodes.map((node) => node.id);
            // 将allnodes存入vuex中
            this.$store.commit("setAllNodes", allnodes);

            this.edges = nodesData.reduce((acc, { kid, predecessors }) => {
                return [
                    ...acc,
                    ...predecessors.map((predecessor) => ({
                        from: predecessor,
                        to: kid,
                    })),
                ];
            }, []);
            //console.log("this.edges=", this.edges);

            // 初始化vis.js网络图
            for (let i = 0; i < nodesData.length; i++) {
                let node = nodesData[i];
                if (node.pdf_url !== null) {
                    this.urls[node.kid - 1] = "http://1.12.235.165/pdf/" + node.pdf_url.slice(0, -4);
                } else {
                    this.urls[node.kid - 1] = "http://1.12.235.165/video/" + node.video_url;
                }
            }
            //console.log("this.urls=", this.urls);
            this.$refs.network.drawGraph();
        },

        async fetchNodesData(kids) {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/knowledgepr/igsys_applied/pullRelation/knowledge_relation?kids=${kids.join()}`
                );
                const relations = res.data;

                let kidsStr = kids;
                const predecessorsMap = relations.reduce((acc, { pre_knowledge_id, sub_knowledge_id }) => {
                    if (!acc[sub_knowledge_id]) {
                        acc[sub_knowledge_id] = [];
                    }
                    acc[sub_knowledge_id].push(pre_knowledge_id);
                    if (!kidsStr.includes(pre_knowledge_id)) kidsStr.push(pre_knowledge_id);
                    return acc;
                }, {});

                kidsStr = kids.join();
                const res2 = await axios.get(
                    `http://localhost:3000/api/knowledgepr/igsys_applied/pullRelation/knowledge_point?kids=${kidsStr}`
                );
                const knowledgeData = res2.data;

                const tmpres = knowledgeData.map((knowledge) => ({
                    ...knowledge,
                    predecessors: predecessorsMap[knowledge.kid] || [],
                }));
                this.$store.commit("updateTmpres", tmpres);
                return tmpres;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
    },
    components: { barGraph, graph },
    mounted() {
        this.$nextTick(() => {
            this.loadGraph();
        });
    },
};
</script>

<style lang="scss">
.attr-container {
    .title {
        text-align: center;
        margin-bottom: 10px;
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid #e4e7ed;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
    }
}
.button-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.button-group .el-button {
    margin: 10px 0;
}
</style>
