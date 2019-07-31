import Main from '@/components/main'
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import(/* webpackChunkName: "login" */ '@/view/login/login.vue')
  },
  {
    path: '/show',
    name: 'show',
    meta: {
      title: '大屏监控',
      hideInMenu: true
    },
    component: () => import(/* webpackChunkName: "show" */ '@/view/show/show.vue')
  },
  {
    path: '/',
    name: '_alarm_monitoring',
    redirect: 'alarm_monitoring',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/alarm_monitoring',
        name: 'alarm_monitoring',
        keepAlive: true,
        meta: {
          hideInMenu: true,
          title: '报警监控',
          icon: 'md-home'
        },
        component: () => import(/* webpackChunkName: "alarm-monitoring" */ '@/view/alarm_monitor/alarm_monitor.vue')
      },
      {
        path: '/trace',
        name: 'trace',
        meta: {
          title: '监控追溯',
          icon: 'md-home'
        },
        component: () => import(/* webpackChunkName: "trance" */ '@/view/trace/trace.vue')
      }
    ]
  },
  {
    path: '/manage',
    name: 'manage',
    component: Main,
    children: [
      {
        path: '/manage/user',
        name: 'manage-user',
        meta: {
          title: '人员管理',
          access: ['manage_user']
        },
        component: () => import(/* webpackChunkName: "manage-user" */ '@/view/manage/person/person.vue')
      },
      {
        path: '/manage/device',
        name: 'manage-device',
        redirect: '/device/data',
        component: () => import(/* webpackChunkName: "manage-device" */'@/view/manage/device/status.vue'),
        // meta: {
        //   title: '设备管理',
        //   access: ['manage_device']
        // },
        children: [
          {
            path: '/device/data',
            name: 'deviceData',
            meta: {
              title: '设备状态-数据列表',
              // keepAlive: true
            },
            component: () => import(/* webpackChunkName: "device-data" */ '@/view/manage/device/components/dataContent.vue')
          },
          {
            path: '/device/map',
            name: 'deviceMap',
            meta: {
              title: '设备状态-地图'
            },
            component: () => import(/* webpackChunkName: "device-map" */'@/view/manage/device/components/mapContent.vue')
          }
        ]
        // component: () => import('@/view/manage/device/device.vue')
      },
      {
        path: '/manage/company',
        name: 'manage-company',
        meta: {
          title: '公司管理',
          access: ['manage_company']
        },
        component: () => import(/* webpackChunkName: "manage-company" */'@/view/manage/company/company.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import(/* webpackChunkName: "401" */'@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import(/* webpackChunkName: "500" */'@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import(/* webpackChunkName: "error-404" */'@/view/error-page/404.vue')
  }
]
