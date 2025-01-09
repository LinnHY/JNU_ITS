<template>
    <div class="circle-shape">
        <v-text :prop-value="element.propValue" :element="element" />
    </div>
</template>

<script>
import OnEvent from '../common/OnEvent'

export default {
    extends: OnEvent, // 继承OnEvent组件
    props: {
        propValue: { // 每个组件数据暴露出一个 propValue 属性用于传递值，对于Circle的意义为圆内的文字
            type: String,
            required: true,
            default: '',
        },
        element: {
            type: Object,
            default: () => {},
        },
    },
}
</script>

<style lang="scss" scoped>
.circle-shape {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: auto;
}
</style>
