<template>
    <div>
        <ul>
            <li v-for="item in sortedComponentData" :key="item.stepId">
                {{ item.stepId }} {{ item.icon === "biaoge" ? "表格" : item.propValue }}
                <span v-if="item.logicStepId > 0">(逻辑步{{ item.logicStepId }})</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState(["componentData"]),
        sortedComponentData() {
            return this.componentData
                .filter((item) => item.hasOwnProperty("stepId"))
                .sort((a, b) => a.stepId - b.stepId);
        },
    },
};
</script>
