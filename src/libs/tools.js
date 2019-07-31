/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

export const getClientHeight = () => {
  var clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
  }
  return clientHeight
}


export const getClientWidth = () => {
  var clientWidth = 0
  if (document.body.clientWidth && document.documentElement.clientWidth) {
    clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth
  } else {
    clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth
  }
  return clientWidth
}


function add0(m){return m<10?'0'+m:m }
// 时间戳格式化11-30 15:28:29
export const RiQi = (sj) => {
  var now = new Date(sj * 1000)
  var month = now.getMonth() + 1
  var date = now.getDate()
  var hour = now.getHours()
  var minute = now.getMinutes()
  return add0(month) + '-' + add0(date) + ' ' + add0(hour) + ':' + add0(minute)
}

export const getDate = (sj, startType) => {
  var now = new Date(sj * 1000)
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var date = now.getDate()
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()
  var str = ''
  switch (startType) {
    case 'year':
      str = year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hour) + ':' + add0(minute) + ':' + add0(second)
      break;
    case 'month':
      str = add0(month) + '-' + add0(date) + ' ' + add0(hour) + ':' + add0(minute)
      break;
    case 'hour':
      str = add0(hour) + ':' + add0(minute)
      break
    case 'month-date': 
      str = add0(month) + ':' + add0(date)
      break
    default:
      str = year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hour) + ':' + add0(minute) + ':' + add0(second)
      break;
  }
  return str
}

export const daterange = (day) => {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
  var endYear=end.getFullYear();
  var endMonth=end.getMonth()+1;
  var endDay=end.getDate();
  var startYear=start.getFullYear();
  var startMonth=start.getMonth()+1;
  var startDay=start.getDate();
  var startStr = startYear + '-' + add0(startMonth) + '-' + add0(startDay)
  var endStr = endYear + '-' + add0(endMonth) + '-' + add0(endDay)
  // console.log(startStr, endStr)
  return [startStr, endStr];
}