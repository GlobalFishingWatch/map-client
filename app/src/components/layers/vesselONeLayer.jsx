import calculateBounds from '../../lib/calculateBounds';
import PelagosClient from '../../lib/pelagosClient';

var createOverlayLayer = function (google) {
  function VesselLayer(map) {

    this.map = map;
    // Explicitly call setMap on this overlay.
    this.setMap(map);
    this.offset = {
      x: 0,
      y: 0
    }

    var canvas = document.createElement('canvas');
    canvas.className = 'this.layer.slug';
    canvas.style.border = '1px solid black';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.style.borderStyle = 'none';
    canvas.style.borderWidth = '0px';
    canvas.style.position = 'absolute';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.canvas = canvas;

    var ctx = canvas.getContext('2d');
    canvas.style.left = 0 + 'px';
    canvas.style.top = 0 + 'px';
    ctx.width = canvas.width = window.innerWidth;
    ctx.height = canvas.height = window.innerHeight;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    canvas.ctx = ctx;
    this.ctx = this.canvas.ctx;
  }

  VesselLayer.prototype = new google.maps.OverlayView();
  VesselLayer.prototype.regenerate = function () {
    this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  VesselLayer.prototype.recalculatePosition = function () {
    this.canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var map = this.getMap();

    // topLeft can't be calculated from map.getBounds(), because bounds are
    // clamped to -180 and 180 when completely zoomed out. Instead, calculate
    // left as an offset from the center, which is an unwrapped LatLng.
    var top = map.getBounds().getNorthEast().lat();
    var center = map.getCenter();
    var scale = Math.pow(2, map.getZoom());
    var left = center.lng() - (this.canvasCssWidth_ * 180) / (256 * scale);
    this.topLeft_ = new google.maps.LatLng(top, left);

    // Canvas position relative to draggable map's container depends on
    // overlayView's projection, not the map's. Have to use the center of the
    // map for this, not the top left, for the same reason as above.
    var projection = this.getProjection();
    var divCenter = projection.fromLatLngToDivPixel(center);
    var offsetX = -Math.round(window.innerWidth / 2 - divCenter.x);
    var offsetY = -Math.round(window.innerHeight / 2 - divCenter.y);
    this.offset = {
      x: offsetX,
      y: offsetY
    }
    this.canvas.style[VesselLayer.CSS_TRANSFORM_] = 'translate(' + offsetX + 'px,' + offsetY + 'px)';
  };

  VesselLayer.CSS_TRANSFORM_ = (function () {
    var div = document.createElement('div');
    var transformProps = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
    for (var i = 0; i < transformProps.length; i++) {
      var prop = transformProps[i];
      if (div.style[prop] !== undefined) {
        return prop;
      }
    }

    // return unprefixed version by default
    return transformProps[0];
  })();

  VesselLayer.prototype.timelineStart = function () {
    this.drawTile()
  };

  VesselLayer.prototype.drawTile = function (data) {
    var overlayProjection = this.getProjection();
    var styles = [['rgba(0,101,193,0.7)',2],['rgba(255,207,59,0.5)',1],['rgba(0,255,242,1)',1]];
    var size = null;
    for (var i = 0, length = data.latitude.length; i < length; i++) {
      var coords = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(data.latitude[i], data.longitude[i]));
      var weight = data.weight[i];
      if (weight > 0.75) {this.ctx.fillStyle = styles[0][0]; size = styles[0][1]}
      else if (weight > 0.50) {this.ctx.fillStyle = styles[1][0]; size = styles[1][1]}
      else {this.ctx.fillStyle = styles[2][0]; size = styles[1][1]}
      this.ctx.fillRect(coords.x - this.offset.x, coords.y - this.offset.y, size, size);
    }
  }
  VesselLayer.prototype.onAdd = function () {
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(this.canvas);
  };

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  VesselLayer.prototype.draw = function () {
  };

  // The onRemove() method will be called automatically from the API if
  // we ever set the overlay's map property to 'null'.
  VesselLayer.prototype.onRemove = function () {
    this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;
  };

  return VesselLayer;
}

export default createOverlayLayer;
