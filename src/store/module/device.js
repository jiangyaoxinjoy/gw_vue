import {
  deviceList,
  deviceMapList,
  volumesetValue,
  deleteDevice,
  getNotifyUsers,
  getDeviceWater,
  getOridata,
  devicebackup
} from '@/api/user'

import {
  Message
} from 'iview'
import config from '@/config'

export default {
  state: {
    deviceStatusParams: {
      companyId: 0,
      online_state: 0,
      addkeys: '',
      pageNum: 1,
      limit: 100,
      status: 3,
    },
    centerMark: {
      lng: 0,
      lat: 0
    },
    deviceIds: '',
    selectedDeviceReset: false,
    refreshDevice: false,
  },
  getters: {
    deviceParams: state => {
      let params = state.deviceStatusParams
      params.offset = (params.pageNum - 1) * params.limit
      return params
    },
  },
  mutations: {
    setRreshDevice(state, payload) {
      state.refreshDevice = payload
    },
    setDeviceParams(state, payload) {
      state.deviceStatusParams = payload
    },
    setCenterMarker(state, payload) {
      state.centerMark = payload
    },
    setDeviceIds(state, payload) {
      state.deviceIds = payload
    },
    SetSelectedDeviceReset(state, payload) {
      state.selectedDeviceReset = payload
    },
  },
  actions: {
    // 获取设备列表
    deviceList({
      state,
      rootState
    }, payload) {
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
    deviceMapList({
      state,
      rootState
    }, payload) {
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
    volumesetValue({
      state,
      rootState
    }, payload) {
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
    deleteDevice({
      state,
      rootState
    }, payload) {
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
    getNotifyUsers({
      state,
      rootState
    }, payload) {
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
    getDeviceWater({
      state,
      rootState
    }, payload) {
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
    getOridata({
      state,
      commit,
      rootState
    }, payload) {
      // console.log(rootState)
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        getOridata(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {}
        }).catch(err => {
          reject(err)
        })
      })
    },
    devicebackup({
      state,
      commit,
      rootState
    }, payload) {
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        devicebackup(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            reject(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}