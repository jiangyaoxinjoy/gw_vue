import Vue from 'vue'
import { Message } from 'iview'
export default {
  state: {
    socket: {
      isConnected: false,
      message: {},
      reconnectError: false,
    }
  },
  mutations: {
    SOCKET_ONOPEN (state, event)  {
      console.log('ws连接成功')
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, e)  {
      console.log('ws关闭')
      // console.log(e)
      // Message.error({
      //   content: 'websocket 断开: ' +  + ' ' + e.reason + ' ' + e.wasClean,
      //   duration: 4
      // })
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, e)  {
      // Message.error({
      //   content: 'websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean,
      //   duration: 4
      // })
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      // console.log(message)
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      // console.log('ws重新连接')
      // console.info(state, count)
      if (state.socket.isConnected) {
        Message.success({
          content: 'websocket 重新连接成功',
          duration: 4
        })
      }
      
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
      Message.error("websocket连接失败")
    },
  },
  actions: {
    sendMessage: function(context, message) {
      Vue.prototype.$socket.send(JSON.stringify(message))
    }
  }
}
