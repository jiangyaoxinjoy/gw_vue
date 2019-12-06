// import axios from 'axios'
import router from '@/router'
import {
  Message
} from 'iview'
import store from '@/store'

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 6000, // 超时时间
      retry: 3,
      retryDelay: 1000,
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
    return config
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      config.url = `${config.url}?_t=${new Date().getTime()}`
      // if (config.method == 'post') {
      //   config.data = {
      //     ...config.data,
      //     _t: new Date().getTime()
      //   }
      // }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // console.log(res.data.msg.includes("ok"))
      // if (res.data.msg.includes("token") || res.data.msg.includes("Token")) {
      //   console.log(router)
      //   store.dispatch('handleLogOut')
      //   router.push({
      //     name: 'login'
      //   })
      //   Message.error({
      //     content: res.data.msg,
      //     duration: 2
      //   })
      // }
      const {
        data,
        status
      } = res
      return {
        data,
        status
      }
    }, error => {
      // console.log(error)
      if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
        // console.log("错误回调", error) 
        Message.error({
          content: "网络超时",
          duration: 2
        })
        return Promise.reject(error); // reject这个错误信息
      } else {
        return Promise.reject(error);
      }
    })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest