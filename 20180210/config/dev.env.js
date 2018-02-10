'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_TYPE: '"dev"',
  BASE_API: '"/api"', // 使用代理
  DEV_UPLOAD_BASE: '"//iotsvr.he-live.com:8002"', // 上传图片路径配置
  DEV_BASE_API: '"//iotsvr.he-live.com:8002"' // cors
})
