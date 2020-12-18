<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="plain" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 侧边栏 -->
        <el-menu
          style="border-right:none"
          background-color="#000000"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <!-- 文本 -->
              <span>{{item.menuName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <i :class="subItem.icon"></i>
                <!-- 文本 -->
                <span>{{subItem.menuName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 侧边栏 -->
      </el-aside>
      <el-main>
        <!-- 主体 -->
        <router-view></router-view>
        <!-- 主体 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "@/utils/api";

export default {
  name: "Main",
  data() {
    return {
      // 左侧菜单数据
      menuList: []
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/");
    },

    getMenus() {
      getMenuList("1").then(res => {
        console.log("234345659999999999 ----------" + res.data);
        this.menuList = res.data;
      });
    }
  }
};
</script>

<style >
html,
body {
  padding: 0;
  margin: 0;
}
.home-container {
  height: 100vh;
  border: 1px solid #eee;
}

.el-header {
  background-color: #000000;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 60px;
  display: flex; /** header 左侧和右侧结构 */
  justify-content: space-between; /** header 左侧和右侧结构 */
  padding-left: 0; /** header 左侧去掉空白 */
  align-items: center; /**退出按钮剧中 */
}

.el-aside {
  background-color: #000000;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>>