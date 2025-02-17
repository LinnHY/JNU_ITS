import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App";
import store from "./store"; // 引入Vuex的store
import router from "./router";
import "@/custom-component"; // 注册自定义组件
import axios from "axios";
import "@/assets/iconfont/iconfont.css";
import "@/styles/animate.scss";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/reset.css";
import "@/styles/global.scss";
import * as echarts from "echarts";
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI, { size: "small" });
Vue.config.productionTip = false;
new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
});
// 全局路由守卫配置在此
