import BMap from 'BMap'

let trackMarkers = []  // 轨迹点覆盖物数组

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
	// 按轨迹点画小车运行轨迹
	drawMapLine(map, trackData){
	  let carMarker = null;
	  let pointType = "node";//点类型
    let trackCount = trackData.length
	  let point = new BMap.Point(trackData[0].longitude, trackData[0].latitude);//起点
	  map.centerAndZoom(point, 12);
	  let onLineCoordinates = [];
	  trackMarkers =[]
	  for (let i = 0; i < trackCount; i++){
	    //线上的点
	    point = new BMap.Point(trackData[i].longitude, trackData[i].latitude);
	    onLineCoordinates.push(point);

	    //描点
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
	  //画线
	  let polyline = new BMap.Polyline(onLineCoordinates);//BMap.Polyline([point1,point2], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1, strokeStyle: 'slolid' });
	  polyline.setStrokeColor("blue");
	  polyline.setStrokeWeight(4);
	  polyline.setStrokeOpacity(1);
	  polyline.setStrokeStyle('solid');
	  map.addOverlay(polyline);
	  //最佳视野
	  map.setViewport(onLineCoordinates); 
	  return trackMarkers;
	}	

  // 停止运动
  // stopOrEndPlay(map, tag, carMarker, carIcon, pointDirection){
  stopOrEndPlay(vm, tag){
    // clearInterval(trackPlayTimer)
    if (tag == 0 && vm.carMarker != null){//主动停止时汽车回到到原点
      vm.carIcon = new BMap.Icon(require(`../images/car/car_p_${vm.pointDirection}.png`), new BMap.Size(36, 36))
      vm.carMarker.setIcon(vm.carIcon)
      vm.carMarker.setPosition(trackMarkers[0].getPosition())
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
}

export default new mapTrack()