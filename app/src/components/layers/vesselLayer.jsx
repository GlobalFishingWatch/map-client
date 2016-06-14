import calculateBounds from '../../lib/calculateBounds';

var getCoordsMap = function (map) {
  var bounds = map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  var bottom = sw.lat();
  var left = sw.lng();
  var top = ne.lat();
  var right = ne.lng();
  return {
    top: top,
    left: left,
    right: right,
    bottom: bottom
  }
};


function VesselLayer(map) {
  // new google.maps.Size(window.innerWidth, window.innerHeight)
  let set = calculateBounds(map);
  var width, height = null;
  for (var i = 0, length = set.length; i < length; i++) {
    if (!width) {
      width = Math.abs(set[i].right - set[i].left);
      height = Math.abs(set[i].top - set[i].bottom);
    }
    var widthn = Math.abs(set[i].right - set[i].left);
    var heightn = Math.abs(set[i].top - set[i].bottom);
    if (widthn !== width || heightn !== height) {
      alert('Peligro');
    }
  }
  let coords = getCoordsMap(map);
  console.log(set.length);
  let tileHeight = (window.innerHeight / (Math.abs(coords.top - coords.bottom))) * (Math.abs(set[0].top - set[0].bottom));
  let tileWidth = (window.innerWidth / (Math.abs(coords.right - coords.left))) * (Math.abs(set[0].right - set[0].left));
  console.log('tileHeight', tileHeight, 'tileWidth', tileWidth);
  this.tileSize = new google.maps.Size(tileWidth, tileHeight);
}
VesselLayer.prototype.getTile = function (coord, zoom, ownerDocument) {

  var canvas = ownerDocument.createElement('canvas');
  canvas.className = 'this.layer.slug';
  canvas.style.border = '1px solid black';
  canvas.style.margin = '0';
  canvas.style.padding = '0';

  // prepare canvas and context sizes
  var ctx = canvas.getContext('2d');
  ctx.width = canvas.width = this.tileSize.width;
  ctx.height = canvas.height = this.tileSize.height;

  canvas.ctx = ctx;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(0, 0, this.tileSize.width, this.tileSize.height);

  return canvas;

};

export default VesselLayer;
