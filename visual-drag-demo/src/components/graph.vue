<template>
    <div ref="networkContainer" class="network-container"></div>
</template>

<script>
import { DataSet, Network } from "vis";

export default {
    name: "RelationGraph",
    props: {
        nodes: {
            type: Array,
            default: () => [],
        },
        edges: {
            type: Array,
            default: () => [],
        },
        urls: {
            type: Array,
            default: () => [],
        },
    },
    mounted() {
        this.drawGraph();
    },
    methods: {
        drawGraph() {
            const container = this.$refs.networkContainer;
            const data = {
                nodes: new DataSet(this.nodes),
                edges: new DataSet(this.edges),
            };
            const options = {
                physics: {
                    enabled: true,
                },
                edges: {
                    smooth: {
                        type: "cubicBezier",
                    },
                    arrows: "to",
                },
                interaction: {
                    hover: true,
                },
            };
            const network = new Network(container, data, options);
            network.on("click", (event) => {
                const nodeId = event.nodes[0];
                const url = this.urls[nodeId - 1]; // 因为节点的 id 是从 1 开始的，所以需要减 1
                if (url) {
                    window.open(url, "_blank");
                }
            });
        },
    },
};
</script>

<style scoped>
.network-container {
    height: 100%;
    width: 100%;
}
</style>
