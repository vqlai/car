/*
 * @file bdmap.js
 * @description 设备在线地图的操作
 * @author vqlai
 * @update (vqlai 2017/8/25)
 */
import BMap from 'BMap' // 通过weback配置来获取BMap对象
// import logoPic from 'common/images/map.png' // 在vue的js里使用图片要important引人或者require进来

let map = null;

/*
 * 地图初始化
 * obj{id,city,lng,lat,minzoom,maxzoom}
 * @returns 返回map
 */
export function initBdMap(obj) {
	map = null
  // 百度地图API功能
  map = new BMap.Map(obj.id)    // 创建Map实例
  var currentPosition = obj.city ? obj.city : new BMap.Point(obj.lng, obj.lat)
  map.centerAndZoom(currentPosition, 12)   // 初始化地图,设置中心点坐标和地图级别
  // map.setCurrentCity('深圳')        // 设置地图显示的城市 此项是必须设置的
  map.enableScrollWheelZoom(true)     // 开启鼠标滚轮缩放
  if(obj.minzoom && obj.maxzoom){
  	map.setMinZoom(obj.minzoom);  //设置地图允许的最小级别
  	map.setMaxZoom(obj.maxzoom);  //设置地图允许的最大级别
  }
  return Promise.resolve(map) // 返回map供在不同场景使用时可修改地图的属性
}