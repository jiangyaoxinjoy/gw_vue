import {
  deviceList,
  deviceMapList,
  volumesetValue,
  deleteDevice,
  getNotifyUsers,
  getDeviceWater
} from '@/api/user'

import { Message } from 'iview'
import config from '@/config'
// import { getToken } from '@/libs/util'

export default {
  state: {
    // token: getToken(),
    deviceStatusParams: {
      companyId: 0,
      online_state: 0,
      addkeys: '',
      pageNum: 1,
      limit: 100,
      status: 3
    },
    centerMark: {
      lng: 0,
      lat: 0
    },
    
  },
  getters: {
    deviceParams: state => {
      let params = state.deviceStatusParams
      params.offset = (params.pageNum - 1) * params.limit
      return params
    }
  },
  mutations: {
    setDeviceParams (state, payload) {
      state.deviceStatusParams = payload
    },
    setCenterMarker (state, payload) {
      state.centerMark = payload
    },
    
  },
  actions: {
    // 获取设备列表
    deviceList ({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        deviceList(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data)
          } else {
            reject(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取设备地图列表
    deviceMapList ({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        deviceMapList(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    //批量设置阀值
    volumesetValue({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        volumesetValue(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data)
          } else {
            Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    //删除设备
    deleteDevice({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        deleteDevice(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data)
          } else {
            Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    //获取可通知用户
    getNotifyUsers({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        getNotifyUsers(payload).then(res => {
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
    getDeviceWater({ state, rootState }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        getDeviceWater(payload).then(res => {
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
  }
}
