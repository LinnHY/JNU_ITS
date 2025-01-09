<template>
    <div class="chart-container" ref="chart" style="width: 100%; height: 300px"></div>
</template>
<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
import axios from "axios";

export default {
    name: "BarChart",
    data() {
        return {
            chart: null,
            option: null,
        };
    },
    computed: {
        ...mapState(["source_id", "relatedKps", "allnodes"]),
    },
    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.option = {
                title: {
                    text: "知识水平横向柱状图",
                    left: "center",
                },
                tooltip: {},
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: {
                    type: "value",
                    max: 10,
                },
                yAxis: {
                    type: "category",
                    //data: this.relatedKps.map((kp) => kp),
                    data: [],
                },
                series: [
                    {
                        name: "知识点掌握度",
                        type: "bar",
                        data: [],
                        color: "orange", // 添加柱状图的颜色
                    },
                ],
            };
        },
    },
    watch: {
        allnodes: {
            handler(newVal) {
                if (newVal.length > 0) {
                    const promises = this.allnodes.map((kp) => {
                        console.log("kp=", kp);
                        const kid = parseInt(kp);
                        const stu_id = this.source_id;
                        console.log("stu_id=", stu_id);
                        let z = 5;
                        return axios
                            .get(`http://localhost:3000/api/knowledgepr/igsys_applied/pullKpLevel/${stu_id}/${kid}`)
                            .then((response) => {
                                z = response.data.kp_level;
                                console.log("z=", z);
                                const knowledge_name = response.data.knowledge_name;
                                return { value: z, name: knowledge_name };
                            })
                            .catch((error) => {
                                console.log(error);
                                return { value: 3, name: "无" };
                            });
                    });
                    //console.log("data=", this.option.series);
                    Promise.all(promises).then((data) => {
                        this.option.yAxis.data = data.map((d) => d.name);
                        this.option.series[0].data = data.map((d) => d.value);
                        this.chart.setOption(this.option);
                    });
                }
            },
            immediate: true,
            deep: true,
        },
    },
};
</script>
