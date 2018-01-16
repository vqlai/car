/*
 * @file bdmap.js
 * @description 设备在线地图的操作
 * @author vqlai
 * @update (vqlai 2017/8/25)
 */
import BMap from 'BMap' // 通过weback配置来获取BMap对象
// import logoPic from 'common/images/map.png' // 在vue的js里使用图片要important引人或者require进来
import { Message } from 'element-ui'
import moment from 'moment';

let map = null;

/*
 * 地图初始化
 * config{domId,city,lng,lat,minzoom,maxzoom,isNavigationControl}
 * @returns 返回map
 */
export function initBdMap(config) {
	map = null
  // 百度地图API功能
  map = new BMap.Map(config.domId, {enableMapClick : false})    // 创建Map实例
  var currentPosition = config.city ? config.city : new BMap.Point(config.lng, config.lat)
  map.centerAndZoom(currentPosition, 12)   // 初始化地图,设置中心点坐标和地图级别
  // map.setCurrentCity('深圳')        // 设置地图显示的城市 此项是必须设置的
  map.enableScrollWheelZoom(true)     // 开启鼠标滚轮缩放
  if(config.minzoom && config.maxzoom){
  	map.setMinZoom(config.minzoom);  //设置地图允许的最小级别
  	map.setMaxZoom(config.maxzoom);  //设置地图允许的最大级别
  }
  if(config.isNavigationControl){
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({ 
      enableGeolocation: false, // 启用显示定位
      anchor:BMAP_ANCHOR_TOP_LEFT // 定位固定位置
    })
    map.addControl(navigationControl)
  }
  return Promise.resolve(map) // 返回map供在不同场景使用时可修改地图的属性
}

/*
 * 添加地图覆盖物
 * @param {object} 设备信息对象
 * @returns 无返回
 */
export function addMapOverlay(obj) {
  let point = new BMap.Point(obj.latest_location.longitude, obj.latest_location.latitude);
  // var myIcon = new BMap.Icon(logoPic, new BMap.Size(35,32));
  let marker = new BMap.Marker(point);  // 创建标注 ,{icon:myIcon}
  map.addOverlay(marker);               // 将标注添加到地图中
  // marker.addEventListener("click",function(e){
  //   openMapDialog(obj)
  // })
  map.panTo(point)
  return marker
}

/*
 * 打开提示窗口
 * @param {obj} 设备信息对象
 * @returns 无返回
 */
export function openMapDialog(obj){
  let opts = {
    width : 300,     // 信息窗口宽度,宽度为0则宽度将按照其内容自动调整
    height: 140,     // 信息窗口高度
    title : `设备编号：${obj.entity_name}`, // 信息窗口标题
    enableAutoPan: true, //是否开启信息窗口打开时地图自动移动
    enableCloseOnClick: true, // 是否开启点击地图关闭信息窗口
    offset: new BMap.Size(-2, -10) // 设置窗口x、y轴的偏移量
  }
  // 注意：百度地图弹窗要先加事件才能调用openInfoWindow方法，否则事件丢失
  let infoWindow = new BMap.InfoWindow(getDialogHtml(obj), opts);  // 创建信息窗口对象
  // infoWindow.addEventListener("open", function (e) { 
  //   document.getElementById("test").onclick = function(){
  //     Message({
  //       message: 'test',
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // document.getElementById("modal").style.display='block'
  //   }
  // })
  // let point = new BMap.Point(obj.latest_location.longitude, obj.latest_location.latitude)
  // map.openInfoWindow(infoWindow, point) //开启信息窗口
  // map.panTo(point) // 将窗口移动到视野中心
  return infoWindow
}

/*
 * 地图窗口HTML模版
 * @param {item} 设备信息对象
 * @returns html模版
 */
function getDialogHtml(obj){
  let time = moment.unix(obj.latest_location.loc_time).format('YYYY-MM-DD HH:mm')
  return `<div class="map-dialog">
          <p>经度：${obj.latest_location.longitude}</p>
          <p>纬度：${obj.latest_location.latitude}</p>
          <p>时速：${obj.latest_location.speed}</p>
          <p>实时时间：${time}</p>
          <a href="javascript:;" id="test">test</a>
        </div>`
}
