/*
 * @file bdmap.js
 * @description 设备在线地图的操作
 * @author vqlai
 * @update (vqlai 2017/8/25)
 */
import BMap from 'BMap' // 通过weback配置来获取BMap对象
// import logoPic from 'common/images/map.png' // 在vue的js里使用图片要important引人或者require进来
import { Message } from 'element-ui'
import moment from 'moment'

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
  map.centerAndZoom(currentPosition, config.zoom)   // 初始化地图,设置中心点坐标和地图级别
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
export function addCarMapOverlay(longitude,latitude) {
  let point = new BMap.Point(longitude, latitude)
  let myIcon = new BMap.Icon(require('../images/map/car.png'), new BMap.Size(40,36))
  let marker = new BMap.Marker(point,{icon:myIcon})  // 创建标注 
  map.addOverlay(marker)               // 将标注添加到地图中
  // marker.addEventListener("click",function(e){
  //   openMapDialog(obj)
  // })
  // map.panTo(point)
  return marker
}

/*
 * 打开提示窗口
 * @param {obj} 设备信息对象
 * @returns 无返回
 */
export function getInfoWindow(obj){
  let opts = {
    width : 480,     // 信息窗口宽度,宽度为0则宽度将按照其内容自动调整
    height: 260,     // 信息窗口高度
    // title : `<div id="map-title">设备编号：${obj.entity_name}</div>`, // 信息窗口标题
    enableAutoPan: true, //是否开启信息窗口打开时地图自动移动
    enableCloseOnClick: true, // 是否开启点击地图关闭信息窗口
    offset: new BMap.Size(0, -6) // 设置窗口x、y轴的偏移量
  }
  // 注意：百度地图弹窗要先加事件才能调用openInfoWindow方法，否则事件丢失
  let infoWindow = new BMap.InfoWindow(getInfoWindowHtml(obj), opts);  // 创建信息窗口对象
  return infoWindow
}

/*
 * 地图窗口HTML模版
 * @param {item} 设备信息对象
 * @returns html模版
 */
function getInfoWindowHtml(obj){
  // let time = moment.unix(obj.latest_location.loc_time).format('YYYY-MM-DD HH:mm')
  let time = obj.update_time ? obj.update_time : ''
  let speed = obj.speed ? obj.speed.toFixed(2) : 0
  let direction = obj.direction ? getDirection(obj.direction) : ''
  return `<div id="map-dialog">
          <div class="title clearfix">
            <div class="left">${obj.vehicle_number}</div>
          </div>
          <ul class="content">
            <li class="clearfix">
              <div class='left'>
                <span>定位类型</span>
                <span>GPS</span>
              </div>
              <div class='right'>
                <span>方向</span>
                <span>${direction}</span>
              </div>
            </li>
            <li class="clearfix">
              <div class='left'>
                <span>活动时间</span>
                <span>${time}</span>
              </div>
              <div class='right'>
                <span>速度</span>
                <span>${speed}km/h</span>
              </div>
            </li>
            <li class="clearfix">
              <div class='left'>
                <span>经纬度</span>
                <span>${obj.longitude.toFixed(5)},${obj.latitude.toFixed(5)}</span>
              </div>
            </li>
            <li class="clearfix">
              <div class='left position'>
                <span>位置</span>
                <span>${obj.address}</span>
              </div>
            </li>
          </ul>
        </div>`
}

// <div class="right">
//   <span>99</span>
//   <span>8</span>
//   <span>22</span>
// </div>

// <div class='right'>
//   <span>ACC</span>
//   <span>启动</span>
// </div>

// <div class="btns">
//   <a href="javascript:;" id="trackBtn">跟踪</a>
//   <a href="/fence" id="fenceBtn">围栏</a>
//   <a href="/track" id="replayBtn">回放</a>
//   <a href="javascript:;" id="dataBtn">资料</a>
//   <a href="javascript:;" id="setupBtn">设置</a>
// </div>


// 获取圆形覆盖物
export function getCircle(point, radius){
  // map.clearOverlays();
  let circle = new BMap.Circle(point,radius, {strokeColor:"red", strokeWeight:3, strokeOpacity:0.8});
  map.addOverlay(circle);  
  map.setViewport([point]); // 调整视野 
  // map.panTo(point);
  // map.setZoom(14);
}
// 获取多边形覆盖物
export function getPolygon(pointData){
  // map.clearOverlays();
  let pointArray = []
  if(typeof pointData == 'string'){
    let arr = pointData.split(';')
    for(let i=0;i<arr.length-1;i++){
      let cache = arr[i].split(',')
      pointArray.push(new BMap.Point(cache[1],cache[0]))
    }
  }else{
    for(let item of pointData){
      pointArray.push(new BMap.Point(item.longitude,item.latitude))
    }
  }
  let polygon = new BMap.Polygon(pointArray, {strokeColor:"red", strokeWeight:3, strokeOpacity:0.8});  //创建多边形
  map.addOverlay(polygon);   //增加多边形
  map.setViewport(pointArray); // 调整视野 
  // map.setZoom(14);
}

// 获取行政区域
export function getBound(area){
  let bdary = new BMap.Boundary();
  bdary.get(area, (rs) => {       // 获取行政区域
    map.clearOverlays();        // 清除地图覆盖物       
    let count = rs.boundaries.length; // 行政区域的点有多少个
    if (count === 0) {
      alert('未能获取当前输入行政区域');
      return ;
    }
    let pointArray = [];
    for (let i = 0; i < count; i++) {
      let ply = new BMap.Polygon(rs.boundaries[i], {strokeColor:"red", strokeWeight:3, strokeOpacity:0.8}); //建立多边形覆盖物
      map.addOverlay(ply);  // 添加覆盖物
      ply.addEventListener("click",(e) => { // 添加事件
        console.log(e)
      })
      pointArray = pointArray.concat(ply.getPath());
    }    
    map.setViewport(pointArray);    // 调整视野 
  })
}

// 经纬度转地址
export function formatLngLat(longitude, latitude){
  return new Promise(function (resolve, reject) {
    let geoc = new BMap.Geocoder()
    let point = new BMap.Point(longitude, latitude)
    geoc.getLocation(point,(rs) => {
      let addComp = rs.addressComponents
      let address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
      // console.log(address)
      resolve(address)
    })
  }) 
}


// 角度转换方向
function getDirection(value){
  if(value == 0){
    return '正北(十二点钟方向)'
  }else if(value > 0 && value <= 45){
    return '东北(一点钟方向)'
  }else if(value > 45 && value < 90){
    return '东北(二点钟方向)'
  }else if(value == 90){
    return '正北(三点钟方向)'
  }else if(value > 90 && value <= 135){
    return '东南(四点钟方向)'
  }else if(value > 135 && value < 180){
    return '东南(五点钟方向)'
  }else if(value == 180){
    return '正南(六点钟方向)'
  }else if(value > 180 && value <= 225){
    return '东西(七点钟方向)'
  }else if(value > 225 && value < 270){
    return '东西(八点钟方向)'
  }else if(value == 270){
    return '正西(九点钟方向)'
  }else if(value > 270 && value <= 315){
    return '西北(十点钟方向)'
  }else if(value > 315 && value < 360){
    return '西北(十一点钟方向)'
  }
}