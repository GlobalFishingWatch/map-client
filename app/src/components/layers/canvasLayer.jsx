import PelagosClient from '../../lib/pelagosClient';

const url = 'https://1fc7a3a3.ngrok.io/pelagos-testtiles/data/'

class CanvasLayer {
  constructor(position, options, map) {
    this.map = map;
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.map.overlayMapTypes.insertAt(position, this);
  }

  _getCanvas(coord, zoom, ownerDocument) {
    // create canvas and reset style
    var canvas = ownerDocument.createElement('canvas');
    canvas.style.border = '1px solid red';
    canvas.style.margin = '0';
    canvas.style.padding = '0';

    // prepare canvas and context sizes
    var ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }
  drawTile(canvas, zoom, data, coord, zoom_diff) {
    const overlayProjection = this.map.getProjection();
    const scale = 1 << zoom;
    const tile_base_x = coord.x * 256;
    const tile_base_y = coord.y * 256;

    let size = zoom > 6
      ? 3
      : 2 || 1;
    for (let i = 0, length = data.latitude.length; i < length; i++) {
      let pointLatLong = overlayProjection.fromLatLngToPoint(new google.maps.LatLng(data.latitude[i], data.longitude[i]));
      const pxcoord = new google.maps.Point(
        Math.floor(pointLatLong.x * scale),
        Math.floor(pointLatLong.y * scale)
      );
      let xcoords = {
        x: (pxcoord.x - tile_base_x) << zoom_diff,
        y: (pxcoord.y - tile_base_y) << zoom_diff
      }
      const weight = data.weight[i];
      if (!weight)
        continue;
      if (weight > 0.9)
        canvas.ctx.fillStyle = 'rgb(255,255,240)';
      else if (weight > 0.05)
        canvas.ctx.fillStyle = 'rgb(10,200,200)';
      else
        canvas.ctx.fillStyle = 'rgb(0,255,242)';
      canvas.ctx.fillRect(~~ xcoords.x, ~~ xcoords.y, size, size);
    }
  }

  getNormalizedCoord(coord, zoom) {
    let y = coord.y;
    let x = coord.x;
    // tile range in one direction range is dependent on zoom level
    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
    const tileRange = 1 << zoom;
    // don't repeat across y-axis (vertically)
    if (y < 0 || y >= tileRange) {
      return null;
    }
    // repeat across x-axis
    if (x < 0 || x >= tileRange) {
      x = (x % tileRange + tileRange) % tileRange;
    }
    return {x: x, y: y};
  }
  getTile(coord, zoom, ownerDocument) {

    var canvas = this._getCanvas(coord, zoom, ownerDocument);
    let coordRec = this.getNormalizedCoord(coord, zoom);
    var zoomDiff = zoom + 8 - Math.min(zoom + 8, 16);
    if(coordRec){
      new PelagosClient().obtainTile(url + `${zoom},${coordRec.x},${coordRec.y}`).then(function(data) {
        this.drawTile(canvas, zoom, data, coordRec, zoomDiff);
      }.bind(this));
    }

    return canvas;
  }
}

export default CanvasLayer;
