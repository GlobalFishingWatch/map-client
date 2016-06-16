import calculateBounds from '../../lib/calculateBounds';

var getCoordsMap = function (bounds, image, map) {
  var bounds = map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  var bottom = sw.lat();
  var left = sw.lng();
  var top = ne.lat();
  var right = ne.lng();
  return {top: top, left: left, right: right, bottom: bottom}
};

var createOverlayLayer = function (google) {
  function VesselLayer(map) {

    let set = calculateBounds(map);
    this.bounds = new Array(set.length);
    for (var i = 0, length = set.length; i < length; i++) {
      this.bounds[i] = new google.maps.LatLngBounds(new google.maps.LatLng(set[i].bottom * .9999, set[i].left * .9999), new google.maps.LatLng(set[i].top * .9999, set[i].right * .9999));
    }

    this.map_ = map;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
  }

  VesselLayer.prototype = new google.maps.OverlayView();
  VesselLayer.prototype.onAdd = function () {

    this.canvasElems = new Array(this.bounds.length);
    var panes = this.getPanes();
    for (var i = 0, length = this.bounds.length; i < length; i++) {
      var canvas = document.createElement('canvas');
      canvas.className = 'this.layer.slug';
      canvas.style.border = '1px solid black';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.style.borderStyle = 'none';
      canvas.style.borderWidth = '0px';
      canvas.style.position = 'absolute';
      panes.overlayLayer.appendChild(canvas);
      this.canvasElems[i] = canvas;
    }

  };

  VesselLayer.prototype.draw = function () {

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    for (var i = 0, length = this.bounds.length; i < length; i++) {
      var bound = this.bounds[i];
      var canvas = this.canvasElems[i];
      var sw = overlayProjection.fromLatLngToDivPixel(bound.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(bound.getNorthEast());
      var ctx = canvas.getContext('2d');
      canvas.style.left = sw.x + 'px';
      canvas.style.top = ne.y + 'px';
      ctx.width = canvas.width = (ne.x - sw.x);
      ctx.height = canvas.height = (sw.y - ne.y);
      console.log('x', sw.x, 'y', ne.y);
      console.log(canvas);

      canvas.ctx = ctx;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, (ne.x - sw.x), (sw.y - ne.y));
    }


  };

  // The onRemove() method will be called automatically from the API if
  // we ever set the overlay's map property to 'null'.
  VesselLayer.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };
  return VesselLayer;
}

export default createOverlayLayer;
