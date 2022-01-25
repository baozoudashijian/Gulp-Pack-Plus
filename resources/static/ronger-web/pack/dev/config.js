
var { deploy } = require('../global')

module.exports = {
  ...deploy,
  base: '/static',
  lib: '/static/lib',
  js: '/static/js',
  img: '/static/img',
  imgStoreUrl: 'https://img-md.veimg.cn/meadin/',
  realName: 'http://localhost:5480',
  noTop: 'no-topheight',
}