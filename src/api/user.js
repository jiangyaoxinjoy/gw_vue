import axios from '@/libs/api.request'

export const login = (payload) => {
  return axios.request({
    url: '/dologin',
    data: JSON.stringify(payload),
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/userInfo',
    method: 'post',
    data: { token: token },
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getUserList = (payload) => {
  return axios.request({
    url: '/userlist',
    method: 'post',
    data: payload,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getCompanyList = (data) => {
  return axios.request({
    url: '/companyList',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getauthList = (data) => {
  return axios.request({
    url: '/authList',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const addUser = (data) => {
  return axios.request({
    url: '/useradd',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const editUser = (data) => {
  return axios.request({
    url: '/useredit',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const userDelete = (data) => {
  return axios.request({
    url: '/userDelete',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const addCom = (data) => {
  return axios.request({
    url: '/comadd',
    method: 'post',
    data: data,
    // transformRequest: (data) => {
    //   return JSON.stringify(data)
    // },
    // headers: {
    //   'Content-Type': 'application/json'
    // }
  })
}

export const editCom = (data) => {
  return axios.request({
    url: '/comedit',
    method: 'post',
    data: data,
    // transformRequest: (data) => {
    //   return JSON.stringify(data)
    // },
    // headers: {
    //   'Content-Type': 'application/json'
    // }
  })
}

export const deviceList = (data) => {
  return axios.request({
    url: '/devicelist',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const deviceMapList = (data) => {
  return axios.request({
    url: '/deviceMapList',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const deviceStateList = (data) => {
  return axios.request({
    url: '/devicestatelist',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDeviceAlertEvent = (data) => {
  return axios.request({
    url: '/deviceAlertEvent',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDeviceAlertOriginData = (data) => {
  return axios.request({
    url: '/deviceAlertOriginData',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const addDevice = (data) => {
  return axios.request({
    url: '/deviceadd',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const editDevice = (data) => {
  return axios.request({
    url: '/deviceedit',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const importDevice = (data) => {
  return axios.request({
    url: '/deviceimport',
    method: 'post',
    data: data
  })
}

export const getAlertList = (data) => {
  return axios.request({
    url: '/alertlist',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDeviceAlertInfo = (data) => {
  return axios.request({
    url: '/alertInfo',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDevicePressurehistory = (data) => {
  return axios.request({
    url: '/devicePressurehistory',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDeviceOpenhistory = (data) => {
  return axios.request({
    url: '/deviceOpenhistory',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getUserNotifyHistory = (data) => {
  return axios.request({
    url: '/userNotifyHistory',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getAlertHistory = (data) => {
  return axios.request({
    url: '/alertTrace',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDeviceAlertDetail = (data) => {
  return axios.request({
    url: '/deviceAlertDetail',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 修改密码
export const changePsd = (data) => {
  return axios.request({
    url: '/changePsd',
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDevicemonitoring = (data) => {
  return axios.request({
    url: "devicemonitoring",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getAlertAnalyze = (data) => {
  return axios.request({
    url: "alertAnalyze",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getShowUnalertDevice = (data) => {
  return axios.request({
    url: "showUnalertDevice",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getCity = (data) => {
  return axios.request({
    url: "getCity",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


export const volumesetValue = (data) => {
  return axios.request({
    url: "setValue",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const deleteDevice = (data) => {
  return axios.request({
    url: "deleteDevice",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getNotifyUsers = (data) => {
  return axios.request({
    url: "getNotifyUsers",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getDeviceWater = (data) => {
  return axios.request({
    url: "deviceWater",
    method: 'post',
    data: data,
    transformRequest: (data) => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const getTreeAlarmData = () => {
  return axios.request({
    url: 'get_tree_Alarm_data',
    method: 'get'
  })
}

export const getAlarmInfo = alarm_id => {
  return axios.request({
    url: 'get_alarm_info',
    method: 'post',
    data: {
      alarm_id
    }
  })
}

export const getPressureHistory = id => {
  return axios.request({
    url: `history?chart=yes&queryTime=1&lang=cn&_dc=${id}`,
    method: 'get'
  })
}

export const getOpenData = id => {
  return axios.request({
    url: `open?dc=${id}`,
    method: 'get'
  })
}

export const getResults = () => {
  return axios.request({
    url: `results`,
    method: 'get'
  })
}

export const getAlarmTrace = () => {
  return axios.request({
    url: 'alarmTrace',
    method: 'get'
  })
}

export const getAlarmDetail = () => {
  return axios.request({
    url: 'alarmDetail',
    method: 'get'
  })
}

