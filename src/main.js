import Vue from "vue";
import VueRouter from "vue-router";
import router from "./router";
import axios from "axios";
// 导入 ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import App from "./App";
import Vuex from "vuex"; //引入状态管理

Vue.prototype.$axios = axios;

// 安装路由
Vue.use(VueRouter);

// 安装 ElementUI
Vue.use(ElementUI);

Vue.use(Vuex);

const ADD_COUNT = "ADD_COUNT"; // 用常量代替事件类型，使得代码更清晰
const REMOVE_COUNT = "REMOVE_COUNT";

//注册状态管理全局参数
var store = new Vuex.Store({
  state: {
    token: "",
    userID: "",
  },
  mutations: {
    //写法与getters相类似
    //组件想要对于vuex 中的数据进行的处理
    //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
    //内部操作必须在此刻完成(同步)
    [ADD_COUNT](state, token) {
      // 第一个参数为 state 用于变更状态 登录
      sessionStorage.setItem("token", token);
      state.token = token;
    },
    [REMOVE_COUNT](state, token) {
      // 退出登录
      sessionStorage.removeItem("token", token);
      state.token = token;
    },
  },
});

router.beforeEach((to, from, next) => {
  store.state.token = sessionStorage.getItem("token");
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    if (store.state.token == "" || store.state.token == null) {
      next({
        path: "/",
        query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  el: "#app",
  router, // 启用路由
  store, //注册组件
  render: (h) => h(App),
});
