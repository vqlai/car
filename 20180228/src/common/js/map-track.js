import BMap from 'BMap'

let trackMarkers = []  // 轨迹点覆盖物数组
let carMarker = null // 小车覆盖物
let carIcon = null // 小车图标
let trackPlayTimer = null // 小车定时器
let movingPointIndex = 0 // 小车移动的步数
let pointDirection = 0 // 方向点

class mapTrack{
	// 创建轨迹点覆盖物
	createPointMarkers(map, pointInfo, pType){
	  let trackMarker; // 轨迹点覆盖物
	  let trackPoint = new BMap.Point(pointInfo.longitude, pointInfo.latitude);
	  let pointDirection = this.getDirection(pointInfo.direction);//方向指针号0~11
	  let pointIcon = new BMap.Icon(require(`../images/node/pnode_${pointDirection}.png`), new BMap.Size(20, 20));
	  if (pType != "node"){
	    pointIcon = new BMap.Icon(require(`../images/${pType}_icon.png`), new BMap.Size(27, 32));
	  }

	  // 描点，创建标注 
	  pointIcon.iconAnchor = new BMap.Point(5, 5);
	  pointIcon.shadow = "";
	  trackMarker = new BMap.Marker(trackPoint, { icon: pointIcon });
	  // trackMarker.setTitle(pointInfo.TracklogID);
	  if (pType == "node"){
	    trackMarker.hide();// 先隐藏，再根据播放需要是否显示
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
	// 按轨迹点画小车运行轨迹
	drawMapLine(map, trackData){
	  carMarker = null; // 搜索则置空小车marker
	  let pointType = "node"; // 点类型
    let trackCount = trackData.length
	  let point = new BMap.Point(trackData[0].longitude, trackData[0].latitude);//起点
	  map.centerAndZoom(point, 12);
	  let onLineCoordinates = [];
	  trackMarkers =[]
	  for (let i = 0; i < trackCount; i++){
	    // 线上的点
	    point = new BMap.Point(trackData[i].longitude, trackData[i].latitude);
	    onLineCoordinates.push(point);

	    // 描点
	    if (i == 0)
	      pointType = "start";
	    else if (i==(trackCount - 1))
	      pointType = "end";
	    else if (trackData[i].StayTime >= 300 && trackData[i].LocateType!=2) //基站点不给停标记
	      pointType = "stay";
	    else
	      pointType = "node";
	    
	    let pointMarker = this.createPointMarkers(map, trackData[i], pointType);
	    trackMarkers.push(pointMarker);
	  }
	  // 画线
	  let polyline = new BMap.Polyline(onLineCoordinates);//BMap.Polyline([point1,point2], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1, strokeStyle: 'slolid' });
	  polyline.setStrokeColor("blue");
    polyline.setStrokeWeight(4);
	  polyline.setStrokeOpacity(0.6);
	  // polyline.setStrokeOpacity(1);
	  polyline.setStrokeStyle('solid');
	  map.addOverlay(polyline);
	  // 最佳视野
	  map.setViewport(onLineCoordinates); 
	  // return trackMarkers;
	}	

  // 轨迹播放  vm为vue对象，this为当前作用域对象
  playTravel(vm){ 
    let trackCount = vm.trackData.length // trackCount 轨迹点数量
    if (trackCount > 1) { 
      if (trackPlayTimer != null){ 
        clearInterval(trackPlayTimer)
      }

      let point = this.getCarIcon(vm, 0)

      // vm.mapObj.centerAndZoom(point, 15)
      movingPointIndex = 0
      console.log(carMarker)
      if (carMarker != null){
        carMarker.setPosition(point)
        // 隐藏轨迹点
        for (var i = 1; i < trackCount - 1; i++){
          if (vm.trackData[i].StayTime < 300 || vm.trackData[i].LocateType == 2)
            trackMarkers[i].hide()
        }
      }else{
        carMarker = new BMap.Marker(point, { icon: carIcon })
        carMarker.addEventListener("click", function(){
          let opts = {
            width : 200,     // 信息窗口宽度
            height: 100,     // 信息窗口高度
            title : "test" , // 信息窗口标题
            enableMessage:true //设置允许信息窗发送短息
          }
          let infoWindow = new BMap.InfoWindow('title', opts)  // 创建信息窗口对象
          // var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(pointInfo));  // 创建信息窗口对象  
          vm.openInfoWindow(infoWindow)
        })
        vm.mapObj.addOverlay(carMarker)
      }

      let that = this
      // console.table(trackMarkers)
      function resetMkPoint(pIndex){
        if (vm.travelIsPlay){
          point = that.getCarIcon(vm,pIndex)
          carMarker.setZIndex(100)
          carMarker.setIcon(carIcon)
          carMarker.setPosition(trackMarkers[pIndex].getPosition())
          //vm.carMarker.show()
          //当前点是否居中
          // if (document.getElementById("chkTerCenter").checked){
              // vm.mapObj.setCenter(point)
          // }else{ // 判断是否超出地图范围，超出则设定当前点为中心点
              var bs = vm.mapObj.getBounds()   //获取可视区域
              var bssw = bs.getSouthWest()   //可视区域左下角，西南
              var bsne = bs.getNorthEast()   //可视区域右上角，东北

              if (point.lng <= bssw.lng || point.lat <= bssw.lat || point.lng >= bsne.lng || point.lat >= bsne.lat)
                vm.mapObj.setCenter(point)
          // }
          //是否显示轨迹点
          // if (document.getElementById("chkShowPoint").checked){ //&& pIndex > 1 && pIndex < trackCount - 1
              trackMarkers[pIndex - 1].show()
          // }

          movingPointIndex++
        }else if (vm.travelIsPause == false){//非暂停则重置
          movingPointIndex = 0
        }
        if (movingPointIndex < trackCount){
          trackPlayTimer = setTimeout(() => { resetMkPoint(movingPointIndex) }, vm.trackSpeed)
        }else{
          that.stopOrEndPlay(vm, 1)
          vm.isPlay = false
          vm.isContinue = false
        }
      }
      trackPlayTimer = setTimeout(() => { resetMkPoint(1) }, vm.trackSpeed)
    }else{
      clearInterval(trackPlayTimer)
    }
  }

  // 根据方向获取小车图标，注：vm是vue对象
  getCarIcon(vm,index){
    let point = trackMarkers[index].getPosition() //起点
    pointDirection = this.getDirection(vm.trackData[index].direction) //方向指针号0~11
    carIcon = new BMap.Icon(require(`@/common/images/car/car_p_${pointDirection}.png`), new BMap.Size(36, 36), {//小车图片
        //offset: new BMap.Size(0, -5),    // 相当于CSS精灵
        imageOffset: new BMap.Size(0, 0)   // 图片的偏移量。为了是图片底部中心对准坐标点。
    })
    return point
  }

  // 停止运动，注：vm是vue对象
  // stopOrEndPlay(map, tag, carMarker, carIcon, pointDirection){
  stopOrEndPlay(vm, tag){
    clearInterval(trackPlayTimer)
    if (tag == 0 && carMarker != null){//主动停止时汽车回到到原点
      carIcon = new BMap.Icon(require(`../images/car/car_p_${pointDirection}.png`), new BMap.Size(36, 36))
      carMarker.setIcon(carIcon)
      carMarker.setPosition(trackMarkers[0].getPosition())
      vm.mapObj.setCenter(trackMarkers[0].getPosition())
    }
  }

	// 方向角度转时针方向
	getDirection(direction) {
    var jiaodu = Math.floor(direction);
    if (jiaodu >= 345 || jiaodu < 15){
      return 0;
    }else if (jiaodu >= 15 && jiaodu < 45){
      return 1;
    }else if (jiaodu >= 45 && jiaodu < 75){
      return 2;
    }else if (jiaodu >= 75 && jiaodu < 105){
      return 3;
    }else if (jiaodu >= 105 && jiaodu < 135){
      return 4;
    }else if (jiaodu >= 135 && jiaodu < 165){
      return 5;
    }else if (jiaodu >= 165 && jiaodu < 195){
      return 6;
    }else if (jiaodu >= 195 && jiaodu < 225){
      return 7;
    }else if (jiaodu >= 225 && jiaodu < 255){
      return 8;
    }else if (jiaodu >= 255 && jiaodu < 285){
      return 9;
    }else if (jiaodu >= 285 && jiaodu < 315){
      return 10;
    }else if (jiaodu >= 315 && jiaodu < 345){
      return 11;
    }
	}
  // 
  getpickerOptions(){
    return {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
  }
}

export default new mapTrack()