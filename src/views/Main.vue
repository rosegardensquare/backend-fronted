<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 侧边栏 -->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>一级菜单</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>二级菜单</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 侧边栏 -->
      </el-aside>
      <el-main>
        <!-- 主体 -->

        <!-- 主体 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Main",
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/");
    }
  }
};
</script>

<style>
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
  background-color: #b3c0d1;
  color: #333;
  font-size: 20px;
  text-align: center;
  line-height: 60px;
  display: flex; /** header 左侧和右侧结构 */
  justify-content: space-between; /** header 左侧和右侧结构 */
  padding-left: 0; /** header 左侧去掉空白 */
  align-items: center; /**退出按钮剧中 */
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center;
  line-height: 200px;-- */
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>>