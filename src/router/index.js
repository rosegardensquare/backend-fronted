import Vue from 'vue'
import Router from 'vue-router'


import Login from '../views/Login';
import Main from '../views/Main';

Vue.use(Router);

export default new Router({
    mode:'history', // 去掉url的#，#vue的hash模式，这是一种默认的方式
    routes: [
      {
        // 登录页
        path: '/',
        name: 'Login',
        component: Login
      },
      {
        // 登录页
        path: '/login',
        name: 'Login',
        component: Login
      },
      {
        // 首页
        path: '/main',
        name: 'Main',
        component: Main
      }
    ]
  });