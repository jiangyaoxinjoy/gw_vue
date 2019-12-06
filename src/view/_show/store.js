import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import user from '@/store/module/user'
import show from '@/store/module/show.js'
import websocket from '@/store/module/websocket.js'

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
  getters: {

  },
  modules: {
    user,
    show,
    websocket
    // app
  },
  plugins: debug ? [createLogger()] : []
})
