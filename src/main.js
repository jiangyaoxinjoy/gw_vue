import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import '@/assets/css/my-theme/index.less'
// import '@/assets/css/varibles.less'
import '@/assets/css/index.css'
import '@/assets/css/index.less'
import '@/assets/icons/iconfont.css'
import filter from '@/libs/filter.js'
import _ from 'lodash'
import registryWindowInfo from '_c/windowInfo/index.js'

Vue.prototype._ = _
Vue.use(registryWindowInfo)
Vue.use(iView)
// installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/*
  全局过滤器
 */
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
