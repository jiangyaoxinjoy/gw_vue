function SquareOverlay (center, length, color,map,deviceId ,fn) {
  this._center = center;
  this._length = length;
  this._color = color; 
  this._map = map 
  this._deviceId = deviceId
  this.name = 'myMarker'
  this._clickFn = fn
  // this._vue = that
}
// 继承API的BMap.Overlay    
// SquareOverlay.prototype = new BMap.Marker()

SquareOverlay.prototype = new BMap.Overlay();
// 实现初始化方法  
SquareOverlay.prototype.initialize = function (map) {   
// console.log(map) 
  // 保存map对象实例   
  // this._map = map;        
  // 创建div元素，作为自定义覆盖物的容器   
  var div = document.createElement("div");    
  div.style.position = "absolute"; 
  div.style.display = "flex"
  div.style.justifyContent = 'center'
  div.style.alignItems = 'center'       
  // 可以根据参数设置元素外观   
  div.style.width = this._length + "px";    
  div.style.height = this._length + "px";   
  div.style.boxShadow = '0px 0px 25px inset' + this._color
  // div.style.boxShadow = 'rgb(0, 255, 128) 0px 0px 25px inset'  
  // div.style.background = this._color;  
  div.style.borderRadius = '50%'  
  div.style.animation = 'scaleDraw 5s infinite'

  var span = document.createElement("span"); 
  span.style.width = this._length/3 + "px";    
  span.style.height = this._length/3 + "px";  
  span.style.background = this._color;  
  span.style.borderRadius = '50%'    
  div.appendChild(span)    
  // 将div添加到覆盖物容器中   
  map.getPanes().labelPane.appendChild(div);      
  // 保存div实例   
  this._div = div;      
  // 需要将div元素作为方法的返回值，当调用该覆盖物的show、   
  // hide方法，或者对覆盖物进行移除时，API都将操作此元素。   
  return div;    
}
// 实现绘制方法   
SquareOverlay.prototype.draw = function () {    
  // 根据地理坐标转换为像素坐标，并设置给容器    
  var that =this;
  var position = this._map.pointToOverlayPixel(this._center);    
  this._div.style.left = position.x - this._length / 2 + "px";    
  this._div.style.top = position.y - this._length / 2 + "px";  
  this._div.onclick = function () {
    that._clickFn(that._center,that._deviceId)
  }
  // this._div.addEventListenzer('click', this._clickFn(this._vue))
  // this._div.onclick = this._clickFn(this._vue)
}
// 实现显示方法    
SquareOverlay.prototype.show = function() {   
  console.log('show') 
  if (this._div) {    
      this._div.style.display = "";    
  }    
}      
// 实现隐藏方法  
SquareOverlay.prototype.hide = function() {    
  if (this._div) {    
      this._div.style.display = "none";    
  }    
}
// 添加自定义方法   
SquareOverlay.prototype.toggle = function() {    
  console.log('1111111')
  // if (this._div) {    
  //     if (this._div.style.display == "") {    
  //         this.hide();    
  //     }    
  //     else {    
  //         this.show();    
  //     }    
  // }    
}

SquareOverlay.prototype.getMsg = function() {    
  console.log('2222')
  return {
    lng: this._center.lng,
    lat: this._center.lat,
    device_id: this._deviceId
  }
}
SquareOverlay.prototype.getPosition = function () {
  return new BMap.Point(this._center.lng, this._center.lat);
}

SquareOverlay.prototype.getMap = function () {
  return this._map
}

SquareOverlay.prototype.addEventListener = function(event,fun){
    // this._div['on'+event] = fun;
    this._div.addEventListener(event, fn)
}
// SquareOverlay.prototype.removeEventListener = function(event,fun){
//         this._div['on'+event] = fun;
//     }

module.exports = SquareOverlay;
