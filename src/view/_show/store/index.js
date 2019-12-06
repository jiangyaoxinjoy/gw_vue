import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import user from './module/user'
import device from './module/device.js'
import alert from './module/alert.js'
import show from './module/show.js'
import websocket from './module/websocket.js'
// import app from './module/app'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    device,
    alert,
    show,
    websocket
    // app
  },
  plugins: debug ? [createLogger()] : []
})
