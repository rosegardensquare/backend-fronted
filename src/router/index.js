import Vue from "vue";
import Router from "vue-router";

import Login from "../views/Login";
import Main from "../views/Main";
import Home from "../views/user/Home";
import List from "../views/user/List";
import Manage from "../views/user/Manage";
import Add from "../views/user/Add";

Vue.use(Router);

export default new Router({
  mode: "history", // 去掉url的#，#是vue的hash模式，这是一种默认的方式
  routes: [
    {
      path: "/", // 登录页
      redirect: '/login', //重定向到/login 
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/main", // 首页
      name: "Main",
      component: Main,
      meta: {
        requireAuth: true, // 表示进入该路由是需要登录的
      },
      redirect: "/home",
      children: [
        {
          path: "/home",
          component: Home,
          meta: {
            requireAuth: true,
          }
        },
        {
          path: "/list",
          component: List,
          meta: {
            requireAuth: true,
          }
        },
        {
          path: "/add",
          component: Add,
          meta: {
            requireAuth: true,
          }
        },
        {
          path: "/manage",
          component: Manage,
          meta: {
            requireAuth: true,
          }
        }
      ]
    },
  ],
});
