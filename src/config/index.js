export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '管威消防',
  /**
   * @description token在Cookie中存储的天数，默认10天
   */
  cookieExpires: 10,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  // useI18n: true,
  // useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: 'http://localhost:8087',
    dev: 'https://console.guanweixiaofang.com',
    // dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
    // pro: 'https://produce.com'
    pro: '/'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  // homeName: 'home',
  homeName: 'alarm_monitoring',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  defaultLocation: {
    lng: 116.404,
    lat: 39.915
  },
  defaultCity: "北京",
  showMapStyleId: '14b72cd191e675ac6257db90d1bf6895',
  wsURL: {
    dev: 'wss://console.guanweixiaofang.com:9000/ws',
    pro: 'wss://console.guanweixiaofang.com:9000/ws'
  },
  mapAk: 'QPPRPzUYlpEqGNkyylz2OuTBQCeWVHAd'
  // wsURL: 'wss://console.guanweixiaofang.com:9000/ws'
}