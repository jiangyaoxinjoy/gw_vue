import {
  getDevicemonitoring,
  getAlertAnalyze,
  getDeviceAlertInfo,
  getShowUnalertDevice
} from '@/api/user.js'

import { Message } from 'iview'

export default {
  state: {

  },
  actions: {
    getDevicemonitoring ({ rootState},payload) {
      return new Promise( (resolve, reject) => {
        payload.token = rootState.user.token
        getDevicemonitoring(payload).then( res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // reject(res.data.msg)
          }
        }).catch( err => {
          reject(err)
        })
      })
    },
    getAlertAnalyze({rootState},payload) {
      return new Promise( (resolve, reject) => {
        payload.token = rootState.user.token
        getAlertAnalyze(payload).then( res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // reject(res.data.msg)
          }
        }).catch( err => {
          reject(err)
        })
      })
    },
    getShowAlertInfo ({ state, commit, rootState }, payload) {
      // console.log(rootState)
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        getDeviceAlertInfo(payload).then(res => {
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
    getShowUnalertDevice( { rootState }, payload) {
      return new Promise( (resolve, reject) => {
        payload.token = rootState.user.token
        getShowUnalertDevice(payload).then(res => {
          if (res.data.status === 0) {
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}