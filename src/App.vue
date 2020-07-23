<template>
  <div id="app">
    <router-view/>
    <!-- 
        <router-view/>: 嵌套命名视图，渲染通过路由映射过来的组件
        程序运行过程中，会将template的内容渲染到app.vue的<router-view>里，从而实现无刷新跳转
     --> 
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>