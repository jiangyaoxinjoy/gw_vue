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
    case 'year-month-date': 
      str = year + '-' + add0(month) + '-' + add0(date)
      break
    default:
      str = year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hour) + ':' + add0(minute) + ':' + add0(second)
      break;
  }
  return str
}

const getDateRangeLength = (startTime, endTime, diffType) => {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime =new Date(startTime); //开始时间
    var eTime =new Date(endTime); //结束时间
    //作为除数的数字
    var timeType =1;
    switch (diffType) {
        case"second":
            timeType =1000;
            break;
        case"minute":
            timeType =1000*60;
            break;
        case"hour":
            timeType =1000*3600;
            break;
        case"day":
            timeType =1000*3600*24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
};


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

//获取日期的方法
const getNewDate = (baseDate,count) => {
    var baseTime = new Date(baseDate)
    baseTime.setDate(baseTime.getDate() + count);
    var year = baseTime.getFullYear();
    var month = baseTime.getMonth() + 1;
    var day = baseTime.getDate();
    if (month < 10) {
        month = "0" + month
    }
    if (day < 10) {
        day = "0" + day
    }
    return year + "-" + month + "-" + day;
};

export const getDateRangeArray = (startDate,endDate,diffType) => {
  var length = getDateRangeLength(startDate,endDate,diffType);
  var dateArray = [];
  //dateArray.push(startDate);
  //console.log(length);
  dateArray.push(endDate)
  for(var i=1;i<=length;i++){
      dateArray.push(getNewDate(endDate,-i));
  }
  return dateArray.sort();
}

export const getAlertType = typeNum => {
  var typeText = ''
  switch (typeNum) {
    case '60':
      typeText = '水压异常'
      break
    case '70':
      typeText = '失联'
      break
    case '120':
      typeText = '阀门打开'
      break 
    case '130':
      typeText = '撞倒'
      break 
    case '80':
      typeText = '水压恢复'
      break 
    case '90':
      typeText = '偷水恢复'
      break 
    case '100':
      typeText = '撞倒恢复'
      break 
    case '110':
      typeText = '离线恢复'
      break
  }
  return typeText
}