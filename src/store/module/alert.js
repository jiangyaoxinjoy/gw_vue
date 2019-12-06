import {
  getDeviceAlertInfo,
  getCity
} from '@/api/user'

import { Message } from 'iview'
import config from '@/config/index.js'

export default {
  state: {
    // curMarker: "",
    alarmTypeList: [
      { 'key': 1, title: '水压异常' },
      { 'key': 2, title: '阀门开启' },
      { 'key': 3, title: '撞倒' }
      // { 'key': 4, title: '离线' }
    ],
    // alarmInfo: {},
    // curDeviceId: '',
    // defaultCity: ''
  },
  // getters: {
  //   getDefalultCity: state => {
  //     return state.defaultCity || config.defaultCity
  //   }
  // },
  mutations: {
    // setCurMarker (state, payload) {
    //   console.log(payload)
    //   if (!payload.lng) return
    //   state.curMarker = {lng: payload.lng, lat: payload.lat}
    //   state.curDeviceId = payload.device_id
    // },
    // setCurDeviceId (state, payload) {
    //   state.curDeviceId = payload
    // },
    // setAlarmInfo (state, payload) {
    //   state.alarmInfo = payload
    // },
    // setDefaultCity (state, payload) {
    //   state.defaultCity = payload
    // }
  },
  actions: {
    // 通过设备id获取设备报警具体信息
    getDeviceAlertInfo ({ state, commit, rootState }, payload) {
      // console.log(rootState)
      return new Promise((resolve, reject) => {
        payload.token = rootState.user.token
        getDeviceAlertInfo(payload).then(res => {
          if (res.data.status === 0) {
            // commit('setAlarmInfo', res.data.data)
            resolve(res.data.data)
          } else {
            // Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },//获取城市
    getCity({ state, rootState,commit }) {
      return new Promise((resolve, reject) => {
        var payload = {}
        payload.token = rootState.user.token
        getCity(payload).then(res => {
          if (res.data.status === 0) {
            var data = res.data.data.replace("市","");
            commit('setDefaultCity', data)
            resolve(data)
          } else {
            commit('setDefaultCity', config.defaultCity)
            resolve(config.defaultCity)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
