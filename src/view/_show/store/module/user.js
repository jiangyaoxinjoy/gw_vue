import {
  login,
  getCompanyList,
  getUserList,
  getUserInfo,
  getauthList,
  addUser,
  editUser,
  addCom,
  editCom,
  addDevice,
  editDevice,
  importDevice,
  getAlertList,
  getDevicePressurehistory,
  getDeviceOpenhistory,
  getUserNotifyHistory,
  getAlertHistory,
  getDeviceAlertEvent,
  getDeviceAlertOriginData,
  getDeviceAlertDetail,
  changePsd,
  userDelete
} from '@/api/user'

import { setToken, getToken } from '@/libs/util'
import { getClientHeight } from '@/libs/tools'
import { Message } from 'iview'
import config from '@/config/index.js'
var url = ''
process.env.NODE_ENV === 'development' ? url = config.baseUrl.dev : url = config.baseUrl.pro

export default {
  state: {
    baseUrl: url,
    userName: '',
    userId: '',
    comId: '',
    companyList: [],
    token: getToken(),
    access: [],
    hasGetInfo: false,
    unreadCount: 0,
    windowH: '',
    authList: [],
    comNav: '',
    routerTransform: 'fade',
    system_name: '',
    companyIcon: '',
    defaultCity: '',
    defaultLng: '',
    defaultLat: ''
  },
  mutations: {
    setDefault( state, payload) {
      state.defaultCity = payload.city
      state.defaultLat = payload.lat
      state.defaultLng = payload.lng
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setComId (state, cid) {
      state.comId = cid
    },
    setSystemName (state, name) {
      state.system_name = name
    },
    setComIcon (state, icon) {
      state.companyIcon = icon
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setStatusResults (state, payload) {
      state.statusResults = payload
    },
    setAlarmTrace (state, payload) {
      state.alarmTrace = payload
    },
    getWindowH (state) {
      state.windowH = getClientHeight()
    },
    setCompanyList (state, payload) {
      state.companyList = payload
    },
    setAuthList (state, payload) {
      state.authList = payload
    }
  },
  getters: {
    getDefalultCity: state => {
      // return '北京市'
      return state.defaultCity || config.defaultCity
    },
    getDefalultLocation: state => {
      if(state.defaultCity != '') {
        return {
          city: state.defaultCity,
          lat: state.defaultLat,
          lng: state.defaultLng
        }
      } else {
        return {
          city: config.defaultCity,
          lat: config.defaultLocation.lat,
          lng: config.defaultLocation.lng
        }
      }
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        login(payload).then(res => {
          // console.log(res)
          if (res.data.status === 0) {
            commit('setToken', res.data.data.token)
            resolve()
          } else {
            Message.error({
              content: res.data.msg,
              duration: 3
            })
          }
        }).catch(err => {
          Message.error({
            content: err,
            duration: 3
          })
          reject(err)
        })
      })
    },
    // 获取用户列表
    getUserList ({ state }, payload) {
      payload.token = state.token
      return new Promise((resolve, reject) => {
        getUserList(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          Message.error(err)
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            // console.log(data)
            if (data.status === 0 && data.data.status != -1) {
              commit('setUserName', data.data.name)
              commit('setUserId', data.data.Id)
              commit('setComId', data.data.company_id)
              commit('setComIcon', data.data.companyIcon)
              commit('setSystemName', data.data.system_name)
              commit('setAccess', data.data.access)
              var reg = new RegExp("市","g");
              var city = data.data.defaultCity.replace(reg,"")
              commit('setDefault', {city:city,lng:data.data.lng,lat:data.data.lat }) 
              commit('setHasGetInfo', true)
              resolve(data.data)
            } else {
              if (data.data.status == -1) {
                Message.error('账号被禁用')
              }else {
                Message.error('重新登录')
              }             
              reject(err)
            }
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取公司列表
    getCompanyList ({ state, commit }, id) {
      return new Promise((resolve, reject) => {
        getCompanyList({ token: state.token, companyId: id }).then(res => {
          commit('setCompanyList', res.data.data)
          resolve(res.data.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取所有权限
    getauthList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getauthList({ token: state.token }).then(res => {
          commit('setAuthList', res.data.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 添加用户
    addUser ({ state }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        addUser(payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 编辑用户信息
    editUser ({ state }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        editUser(payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 添加公司
    addCom ({ state }, payload) {
      return new Promise((resolve, reject) => {
        // payload.token = state.token
        // // var form_data = new FormData();
        // // var post = payload
        // var form_data = makeFormData(payload);
        addCom( payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 编辑公司
    editCom ({ state }, payload) {
      return new Promise((resolve, reject) => {
        // payload.token = state.token
        // console.log(payload)
        
        // var form_data = makeFormData(payload);
        editCom(payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 添加设备
    addDevice ({ state }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        addDevice(payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 编辑设备
    editDevice ({ state }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        editDevice(payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 批量上传设备
    importDevice ({ state }, payload) {
      return new Promise((resolve, reject) => {
        importDevice(payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取报警列表
    getAlertList ({ state }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getAlertList(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取设备压力历史
    getDevicePressurehistory ({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getDevicePressurehistory(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取设备阀门打开记录
    getDeviceOpenhistory ({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getDeviceOpenhistory(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户收到的某个设备的通知
    getUserNotifyHistory ({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getUserNotifyHistory(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAlertHistory ({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getAlertHistory(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取设备事件
    getDeviceAlertEvent ({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getDeviceAlertEvent(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取设备事件原始数据
    getDeviceAlertOriginData ({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getDeviceAlertOriginData(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取设备告警详情
    getDeviceAlertDetail ({ state, commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        getDeviceAlertDetail(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 修改密码
    changePsd ({ state, dispatch,commit }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        changePsd(payload).then(res => {
          if (res.data.status === 0) {
            dispatch('handleLogOut')
            // commit('setToken', '')
            // commit('setCompanyList', [])
            // commit('setAccess', [])
            resolve(res.data)
          } else {
            Message.error({
              content: res.data.msg,
              duration: 3
            })
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    //删除人员
    userDelete({ state }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = state.token
        userDelete(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data)
          } else {
            Message.error({
              content: res.data.msg,
              duration: 2
            })
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      commit('setToken', '')
      commit('setAuthList', [])
      commit('setCompanyList', [])
      commit('setAccess', [])
      commit('setHasGetInfo',false)
      commit('setUserId', '')
      commit('setComId', '')
      commit('setUserName', '')
      commit('setComIcon', '')
      commit('setSystemName', '')
      commit('setDefault', {}) 
    }
  }
}
