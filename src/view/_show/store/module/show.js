import {
  getDevicemonitoring,
  getAlertAnalyze,
  getDeviceAlertInfo,
  getShowUnalertDevice,
  statisticalChart
} from '@/api/user.js'

import { Message } from 'iview'
import { getToken } from '@/libs/util'

export default {
  state: {
    token: getToken()
  },
  actions: {
    getDevicemonitoring ({ state},payload) {
      return new Promise( (resolve, reject) => {
        payload.token = state.token
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
    getAlertAnalyze({state},payload) {
      return new Promise( (resolve, reject) => {
        payload.token = state.token
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
    getShowAlertInfo ({ state, commit}, payload) {
      // console.log(rootState)
      return new Promise((resolve, reject) => {
        payload.token = state.token
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
    getShowUnalertDevice( { state }, payload) {
      return new Promise( (resolve, reject) => {
        payload.token = state.token
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
    },
    getStatisticalChart( { state }, payload) {
      return new Promise( (resolve, reject) => {
        payload.token = state.token
        statisticalChart(payload).then(res => {
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