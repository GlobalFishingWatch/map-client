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
  let set = calculateBounds(map);
  var width, height = null;
  for (var i = 0, length = set.length; i < length; i++) {
    if (!width) {
      width = ~~(set[i].right - set[i].left);
      height = ~~(set[i].top - set[i].bottom);
    }
    var widthn = ~~(set[i].right - set[i].left);
    var heightn = ~~(set[i].top - set[i].bottom);
  }
  let coords = getCoordsMap(map);
  let tileHeight = (window.innerHeight / (~~(coords.top - coords.bottom))) * (~~(set[0].top - set[0].bottom));
  let tileWidth = (window.innerWidth / (~~(coords.right - coords.left))) * (~~(set[0].right - set[0].left));
  console.log('tileHeight', tileHeight, 'tileWidth', tileWidth);
  this.tileSize = new google.maps.Size(tileWidth, tileHeight);
}
VesselLayer.prototype.getTile = function (coord, zoom, ownerDocument) {

  var canvas = ownerDocument.createElement('canvas');
  canvas.className = 'fishingCanvas';
  canvas.style.margin = '0';
  canvas.style.padding = '0';

  // prepare canvas and context sizes
  var ctx = canvas.getContext('2d');
  ctx.width = this.tileSize.width;
  ctx.height = this.tileSize.height;
  ctx.fillRect(0, 0, this.tileSize.width, this.tileSize.height);

  return canvas;

};

export default VesselLayer;
