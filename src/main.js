// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import axios from 'axios'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import '@/assets/index.css'
import Http from '@/plugins/http.js'
import MyBread from '@/components/cusBread'

Vue.config.productionTip = false
Vue.use(Http)
// 全局面包屑组件
Vue.component(MyBread.name,MyBread)
// 处理日期的全局过滤器
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
