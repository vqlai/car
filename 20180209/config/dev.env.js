'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_TYPE: '"dev"',
  BASE_API: '"/api"', // 使用代理
  DEV_UPLOAD_BASE: '"//10.0.0.211:9999"' // 上传图片路径配置
  // BASE_API: '"http://localhost:3100/api"' // cors
})
