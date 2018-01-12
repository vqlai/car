/*
 * @file bdmap.js
 * @description 设备在线地图的操作
 * @author vqlai
 * @update (vqlai 2017/8/25)
 */
import BMap from 'BMap' // 通过weback配置来获取BMap对象
// import logoPic from 'common/images/map.png' // 在vue的js里使用图片要important引人或者require进来
import { Message } from 'element-ui'
import track from '@/common/js/track.js'

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
  marker.addEventListener("click",function(e){
    openMapDialog(obj)
  })
  map.panTo(point)
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
  let infoWindow = new BMap.InfoWindow(getDialogHtml(obj), opts);  // 创建信息窗口对象
  let point = new BMap.Point(obj.latest_location.longitude, obj.latest_location.latitude)
  map.openInfoWindow(infoWindow, point); //开启信息窗口
  map.panTo(point) // 将窗口移动到视野中心
  // function showMsg(){
  //   Message({
  //       message: 'test',
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  // }
}

/*
 * 地图窗口HTML模版
 * @param {item} 设备信息对象
 * @returns html模版
 */
function getDialogHtml(obj){
  return `<div class="map-dialog">
          <p>经度：${obj.latest_location.longitude}</p>
          <p>纬度：${obj.latest_location.latitude}</p>
          <p>时速：${obj.latest_location.speed}</p>
          <p>实时时间：${obj.latest_location.loc_time}</p>
          <a href="javascript:;" onclick="showMsg(this)">test</a>
        </div>`
}

// 创建轨迹点覆盖物
function createPointMarkers(pointInfo, pType){
  var trackMarker;
  var trackPoint = new BMap.Point(pointInfo.longitude, pointInfo.latitude);
  var pointDirection = track.getDirection(pointInfo.direction);//方向指针号0~11
  var pointIcon = new BMap.Icon(require(`../images/node/pnode_${pointDirection}.png`), new BMap.Size(20, 20));
  if (pType != "node"){
    pointIcon = new BMap.Icon(require(`../images/${pType}_icon.png`), new BMap.Size(27, 32));
  }

  //描点，创建标注 
  pointIcon.iconAnchor = new BMap.Point(5, 5);
  pointIcon.shadow = "";
  trackMarker = new BMap.Marker(trackPoint, { icon: pointIcon });
  //trackMarker.setTitle(pointInfo.TracklogID);
  if (pType == "node"){
    trackMarker.hide();//先隐藏，再根据播放需要是否显示
  }else{
    trackMarker.setOffset(new BMap.Size(-1, -15));//大图标，偏移确定图片在点正上方
  }

  trackMarker.addEventListener("click", function (){
    let opts = {
      width : 200,     // 信息窗口宽度
      height: 100,     // 信息窗口高度
      title : "test" , // 信息窗口标题
      enableMessage:true //设置允许信息窗发送短息
    }
    let infoWindow = new BMap.InfoWindow('title', opts);  // 创建信息窗口对象
    // var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(pointInfo));  // 创建信息窗口对象  
    this.openInfoWindow(infoWindow);
  });
  map.addOverlay(trackMarker);
  return trackMarker;
}
export function drawMapLine(tracks,count){
  console.log(tracks)
  var TrackData = tracks;
  var trackCount = count;
  var carMarker = null;
  var pointType = "node";//点类型
  var pointLogLat = new BMap.Point(TrackData[0].longitude, TrackData[0].latitude);//起点
  map.centerAndZoom(pointLogLat, 13);
  var onLineCoordinates = [];
  var trackMarkers =[]
  for (var i = 0; i < trackCount; i++){
    //线上的点
    pointLogLat = new BMap.Point(TrackData[i].longitude, TrackData[i].latitude);
    onLineCoordinates.push(pointLogLat);

    //描点
    if (i == 0)
      pointType = "start";
    else if (i==(trackCount - 1))
      pointType = "end";
    else if (TrackData[i].StayTime >= 300 && TrackData[i].LocateType!=2) //基站点不给停标记
      pointType = "stay";
    else
      pointType = "node";
    
    var pointMarker = createPointMarkers(TrackData[i], pointType);
    trackMarkers.push(pointMarker);
  }
  //画线
  var polyline = new BMap.Polyline(onLineCoordinates);//BMap.Polyline([point1,point2], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1, strokeStyle: 'slolid' });
  polyline.setStrokeColor("blue");
  polyline.setStrokeWeight(4);
  polyline.setStrokeOpacity(1);
  polyline.setStrokeStyle('solid');
  map.addOverlay(polyline);
  //最佳视野
  map.setViewport(onLineCoordinates); 
  return trackMarkers;
}