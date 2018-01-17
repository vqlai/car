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
  let point = new BMap.Point(obj.latest_location.longitude, obj.latest_location.latitude)
  let myIcon = new BMap.Icon(require('../images/map/car.png'), new BMap.Size(40,36))
  let marker = new BMap.Marker(point,{icon:myIcon})  // 创建标注 
  map.addOverlay(marker)               // 将标注添加到地图中
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
    width : 480,     // 信息窗口宽度,宽度为0则宽度将按照其内容自动调整
    height: 260,     // 信息窗口高度
    // title : `<div id="map-title">设备编号：${obj.entity_name}</div>`, // 信息窗口标题
    enableAutoPan: true, //是否开启信息窗口打开时地图自动移动
    enableCloseOnClick: true, // 是否开启点击地图关闭信息窗口
    offset: new BMap.Size(0, -6) // 设置窗口x、y轴的偏移量
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
  return `<div id="map-dialog">
          <div class="title">
            <div class="left">${obj.entity_name}</div>
            <div class="right">
              <span>99</span>
              <span>8</span>
              <span>22</span>
            </div>
          </div>
          <ul class="content">
            <li class="clearfix">
              <div class='left'>
                <span>定位类型</span>
                <span>GPS</span>
              </div>
              <div class='right'>
                <span>方向</span>
                <span>西北（十一点钟反向）</span>
              </div>
            </li>
            <li class="clearfix">
              <div class='left'>
                <span>活动时间</span>
                <span>${time}</span>
              </div>
              <div class='right'>
                <span>速度</span>
                <span>27km/h</span>
              </div>
            </li>
            <li class="clearfix">
              <div class='left'>
                <span>经纬度</span>
                <span>${obj.latest_location.longitude.toFixed(5)},${obj.latest_location.latitude.toFixed(5)}</span>
              </div>
              <div class='right'>
                <span>ACC</span>
                <span>启动</span>
              </div>
            </li>
            <li class="clearfix">
              <div class='left position'>
                <span>位置</span>
                <span>广东深圳市南山区高新园长虹大厦旁</span>
              </div>
            </li>
          </ul>
          <div class="btns">
            <a href="javascript:;" id="trackBrn">跟踪</a>
            <a href="javascript:;" id="fenceBtn">围栏</a>
            <a href="javascript:;" id="replayBtn">回放</a>
            <a href="javascript:;" id="dataBtn">资料</a>
            <a href="javascript:;" id="setupBtn">设置</a>
          </div>
        </div>`
}

// <p>经度：${obj.latest_location.longitude}</p>
//           <p>纬度：${obj.latest_location.latitude}</p>
//           <p>时速：${obj.latest_location.speed}</p>
//           <p>实时时间：${time}</p>
