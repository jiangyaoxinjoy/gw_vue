// import Vue from 'vue'
import App from './App'
import "babel-polyfill"
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
// import _ from 'lodash'
import registryWindowInfo from '_c/windowInfo/index.js'
import VueNativeSock from 'vue-native-websocket'
// import { Message, LoadingBar } from 'iview';
// Vue.component('Message', Message);
// // Vue.component('LoadingBar', LoadingBar);
// Vue.prototype.$Message = Message
// import * as socketApi from './api/socket'


// Vue.prototype.socketApi = socketApi
Vue.use(registryWindowInfo)
Vue.use(iView)
const wsURL = process.env.NODE_ENV === 'development' ? config.wsURL.dev : config.wsURL.pro
Vue.use(VueNativeSock, wsURL, {
  connectManually: true,
  store: store,
  format: 'json',
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
})
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