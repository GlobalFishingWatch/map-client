import PelagosClient from '../../lib/pelagosClient';



class CanvasLayer {
  constructor(position, options, map) {
    this.map = map;
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.map.overlayMapTypes.insertAt(position, this );
  }

  _getCanvas(coord, zoom, ownerDocument) {
    // create canvas and reset style
    var canvas = ownerDocument.createElement('canvas');
    canvas.style.border = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';

    // prepare canvas and context sizes
    var ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }
  drawTile(canvas, zoom, data){
    const overlayProjection = this.map.getProjection();
    let size = zoom > 6 ? 3 : 2 || 1;
    for (let i = 0, length = data.latitude.length; i < length; i++) {
      let coords = overlayProjection.fromLatLngToPoint(new google.maps.LatLng(data.latitude[i], data.longitude[i]));
      const weight = data.weight[i];
      if (!weight) continue;
      if (weight > 0.9)       canvas.ctx.fillStyle = 'rgb(255,255,240)';
      else if (weight > 0.05) canvas.ctx.fillStyle = 'rgb(10,200,200)';
      else                    canvas.ctx.fillStyle = 'rgb(0,255,242)';
      canvas.ctx.fillRect(~~coords.x , ~~coords.y, size, size);
    }
  }
  getTile(coord, zoom, ownerDocument) {

    var canvas = this._getCanvas(coord, zoom, ownerDocument);
    //  var sql = this._getSQL(coord.x, coord.y, zoom);
    var zoomDiff = zoom + 8 - Math.min(zoom + 8, 16);

    new PelagosClient().obtainTile(`http://localhost:8080/${coord.x},${coord.y},${zoom}`).then(function (data) {
      let obj = {};
      this.drawTile(canvas, zoom, data);
    }.bind(this));

    //  this.cartoSQL.execute(sql, _.bind(function(data) {
    //    if (!data) {return;}
    //
    //    var tile = {
    //      canvas: canvas,
    //      ctx: canvas.ctx,
    //      width: this.tileSize.width,
    //      coord: coord,
    //      zoom: zoom,
    //      height: this.tileSize.height,
    //      cells: this.preCacheMonths(data.rows, coord, zoom,
    //        zoomDiff),
    //      top_date : data.top_date
    //    };
    //
    //    //set unique id
    //    var tileId = '{0}_{1}_{2}'.format(coord.x, coord.y, zoom);
    //    canvas.setAttribute('id', tileId);
    //
    //    if (tileId in this.tiles) {
    //      delete this.tiles[tileId];
    //    }
    //
    //    this.tiles[tileId] = tile;
    //
    //    this._render(tile);
    //  }, this));

    return canvas;
  }
}

export default CanvasLayer;
