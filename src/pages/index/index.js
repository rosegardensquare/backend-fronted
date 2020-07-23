import Vue from 'vue'
import App from './index.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' //样式必须引入
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) }
}).$mount('#app')
