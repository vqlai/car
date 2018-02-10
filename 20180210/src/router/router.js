// const Login = resolve => { require(['@/pages/login'], resolve); }
// 根据环境的不同切换路由懒加载
const _import = require('./_import_' + process.env.NODE_ENV)

// 404页面
export const page404 = {
  path: '/*',     //  匹配所有页面，找不到存在的路由则跳到404
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: _import('error/404')
}

// 主路由
export const appRouter = [
  {
    path:"/",
    redirect: '/index'
  },{
    path: '/index',
    name: 'Index',
    title: '首页',
    sign: 1,
    component: _import('index/index')
  },{
    path: '/monitor',
    name: 'Monitor',
    title: '实时追踪',
    sign: 2,
    component: _import('drive/monitor/monitor')
  },{
    path: '/track',
    name: 'Track',
    title: '历史轨迹',
    sign: 2,
    component: _import('drive/track/track')
  },{
    path: '/data',
    name: 'Data',
    title: '行程数据',
    sign: 2,
    component: _import('drive/data/data')
  },{
    path: '/record',
    name: 'Record',
    title: '行程记录',
    sign: 2,
    component: _import('drive/record/record')
  },{
    path: '/fence',
    name: 'Fence',
    title: '围栏设置',
    sign: 3,
    component: _import('operation/fence/fence')
  },{
    path: '/control',
    name: 'Control',
    title: '远程控制',
    sign: 3,
    component: _import('operation/control/control')
  },{
    path: '/behavior',
    name: 'Behavior',
    title: '驾驶行为',
    sign: 3,
    component: _import('operation/behavior/behavior')
  },{
    path: '/state',
    name: 'State',
    title: '车况监控',
    sign: 3,
    component: _import('operation/state/state')
  },{
    path: '/bind',
    name: 'Bind',
    title: '车辆绑定',
    sign: 4,
    component: _import('traffic/bind/bind')
  },{
    path: '/charge',
    name: 'Charge',
    title: '收费方案',
    sign: 4,
    component: _import('traffic/charge/charge')
  },{
    path: '/rental',
    name: 'Rental',
    title: '租还车',
    sign: 4,
    component: _import('traffic/rental/rental')
  },{
    path: '/website',
    name: 'Website',
    title: '网点维护',
    sign: 4,
    component: _import('traffic/website/website')
  },{
    path: '/message',
    name: 'Message',
    title: '消息管理',
    sign: 4,
    component: _import('traffic/message/message')
  },{
    path: '/count',
    name: 'Count',
    title: '数据统计',
    sign: 4,
    component: _import('traffic/count/count')
  }
];

export const routers = [
  ...appRouter,
  page404
]