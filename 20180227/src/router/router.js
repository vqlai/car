// 根据环境的不同切换路由懒加载
const _import = require('./_import_' + process.env.NODE_ENV)

const Main = _import('main/main')

// 登录页面
export const login = {
  path: '/login',
  name: 'Login',
  title: '登录',
  hidden: true,
  component: _import('login/login')
}

// 404页面
export const page404 = {
  path: '/*',     //  匹配所有页面，找不到存在的路由则跳到404
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  hidden: true,
  component: _import('error/404')
}

// 作为Main组件的子页面展示但是不显示菜单面包屑等路由写在otherRouter里
export const otherRouter = {
  path: '/',
  // name: 'index',
  // title: '首页',
  component: Main,  // 主组件
  redirect: '/index',  // 设置空url跳转到home页面
  children: [  // 子路由，显示在主组件的<router-view></router-view>里
    { path: 'index', title:'首页', name: 'index', component: _import('index/index')} // , title: {i18n: 'home'}
  ]
}

// 行车管理路由
export const driveRouter = {
  path: '/drive',
  name: 'drive',
  title: '行车管理',
  component: Main,
  children: [
    {
      path: 'monitor',
      name: 'monitor',
      title: '实时追踪',
      component: _import('drive/monitor/monitor')
    },{
      path: 'track',
      name: 'track',
      title: '历史轨迹',
      component: _import('drive/track/track')
    },{
      path: 'data',
      name: 'data',
      title: '行程数据',
      component: _import('drive/data/data')
    },{
      path: 'record',
      name: 'record',
      title: '行程记录',
      component: _import('drive/record/record')
    },{
      path: 'alarm',
      name: 'alarm',
      title: '报警管理',
      component: _import('drive/alarm/alarm')
    }
  ]
}
// 运营管理路由
export const operationRouter = {
  path: '/operation',
  name: 'operation',
  title: '运营管理',
  component: Main,
  children: [
    {
      path: 'fence',
      name: 'fence',
      title: '围栏设置',
      component: _import('operation/fence/fence')
    },{
      path: 'control',
      name: 'control',
      title: '远程控制',
      component: _import('operation/control/control')
    },{
      path: 'behavior',
      name: 'behavior',
      title: '驾驶行为',
      component: _import('operation/behavior/behavior')
    },{
      path: 'state',
      name: 'state',
      title: '车况监控',
      component: _import('operation/state/state')
    }
  ]
}
// 车务管理路由
export const trafficRouter = {
  path: '/traffic',
  name: 'traffic',
  title: '车务管理',
  component: Main,
  children: [
    {
      path: 'bind',
      name: 'bind',
      title: '车辆绑定',
      component: _import('traffic/bind/bind')
    },{
      path: 'charge',
      name: 'charge',
      title: '收费方案',
      component: _import('traffic/charge/charge')
    },{
      path: 'rental',
      name: 'rental',
      title: '租还车',
      component: _import('traffic/rental/rental')
    },{
      path: 'website',
      name: 'website',
      title: '网点维护',
      component: _import('traffic/website/website')
    },{
      path: 'message',
      name: 'message',
      title: '消息管理',
      component: _import('traffic/message/message')
    },{
      path: 'count',
      name: 'count',
      title: '数据统计',
      component: _import('traffic/count/count')
    }
  ]
}

// 主页面路由 
export const appRouter = [driveRouter, operationRouter, trafficRouter]

export const routers = [
  login,
  otherRouter,
  ...appRouter,
  page404
]