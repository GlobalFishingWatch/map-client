import PelagosClient from "../../lib/pelagosClient";

const url = 'https://storage.googleapis.com/vizzuality-staging/random/'
const DAY_MS = 24 * 60 * 60 * 1000;

class CanvasLayer {
  constructor(position, options, map) {
    this.map = map;
    this.data = {};
    this.position = position;
    this.minDate = Date.now();
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.map.overlayMapTypes.insertAt(this.position, this);
    this.visible = true;
    this.filters = {}
  }

  hide() {
    this.visible = false;
    this.map.overlayMapTypes.removeAt(this.position);
  }

  show() {
    this.visible = true;
    this.map.overlayMapTypes.insertAt(this.position, this);
  }

  isVisible() {
    return this.visible;
  }

  applyFilters(filters) {
    if (filters.timeline) {
      this.filters.timeline = filters.timeline;
    }
    this.show();
  }

  resetData() {
    this.data = {};
  }

  _getCanvas(coord, zoom, ownerDocument) {
    // create canvas and reset style
    var canvas = ownerDocument.createElement('canvas');
    canvas.style.border = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.id = `${zoom},${coord.x},${coord.y}`;

    // prepare canvas and context sizes
    var ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }

  drawFrame(pos, zoom) {
    let canvasKeys = Object.keys(this.data);
    for (let i = 0, length = canvasKeys.length; i < length; i++) {
      if (this.data[canvasKeys[i]] && this.data[canvasKeys[i]][pos]) {
        let data = this.data[canvasKeys[i]][pos];
        this.drawTile2Canvas(canvasKeys[i], data, false);
      }
    }
  }

  drawTile2Canvas(idCanvas, data, accumulative) {
    let canvas = document.getElementById(idCanvas);
    if (!canvas) return;
    if (!accumulative) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    let size = this.map.getZoom() > 6
      ? 3
      : 2 || 1;
    for (let j = 0, lengthData = data.latitude.length; j < lengthData; j++) {
      const weight = data.weight[j];
      if (weight > 0.9)
        canvas.ctx.fillStyle = 'rgba(218,165,32,.8)';
      else if (weight > 0.05)
        canvas.ctx.fillStyle = 'rgb(10,200,200)';
      else
        canvas.ctx.fillStyle = 'rgb(0,255,242)';
      canvas.ctx.fillRect(~~data.x, ~~data.y, size, size);
      canvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      canvas.ctx.fillRect(~~data.x[j]+1, ~~data.y[j]+0, size +1, size +1);
      canvas.ctx.fillRect(~~data.x[j]+1, ~~data.y[j]+1, size +1, size +1);
      canvas.ctx.fillRect(~~data.x[j]-1, ~~data.y[j]-0, size +1, size +1);
      canvas.ctx.fillRect(~~data.x[j]-1, ~~data.y[j]-1, size +1, size +1);
    }
  }

  regenerate() {
    let canvasKeys = Object.keys(this.data);
    for (let i = 0, length = canvasKeys.length; i < length; i++) {
      let times = Object.keys(this.data[canvasKeys[i]]);
      for (let j = 0, lengthTime = times.length; j < lengthTime; j++) {
        this.drawTile2Canvas(canvasKeys[i], this.data[canvasKeys[i]][times[j]], true);
      }
    }
  }

  drawTile(canvas, zoom, data, coord, zoom_diff, filters) {
    let parseData = false;
    if (!this.data[`${zoom},${coord.x},${coord.y}`]) {
      parseData = true;
      this.data[`${zoom},${coord.x},${coord.y}`] = {};
    }
    const overlayProjection = this.map.getProjection();
    const scale = 1 << zoom;
    const tile_base_x = coord.x * 256;
    const tile_base_y = coord.y * 256;

    let size = zoom > 6
      ? 3
      : 2 || 1;
    for (let i = 0, length = data.latitude.length; i < length; i++) {
      if (!!filters && filters.hasOwnProperty('timeline') &&
        (data.datetime[i] < filters.timeline[0] || data.datetime[i] > filters.timeline[1]) || !data.weight[i]) {
        continue;
      }
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
      if (weight > 0.9)
        canvas.ctx.fillStyle = 'rgba(218,165,32,.8)';
      else if (weight > 0.05)
        canvas.ctx.fillStyle = 'rgb(10,200,200)';
      else
        canvas.ctx.fillStyle = 'rgb(0,255,242)';
      canvas.ctx.fillRect(~~xcoords.x, ~~xcoords.y, size, size);
      canvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      canvas.ctx.fillRect(~~xcoords.x+1, ~~xcoords.y+0, size +1, size +1);
      canvas.ctx.fillRect(~~xcoords.x+1, ~~xcoords.y+1, size +1, size +1);
      canvas.ctx.fillRect(~~xcoords.x-1, ~~xcoords.y-0, size +1, size +1);
      canvas.ctx.fillRect(~~xcoords.x-1, ~~xcoords.y-1, size +1, size +1);
      if (parseData) {
        let time = data.datetime[i] - (data.datetime[i] % DAY_MS);
        if (!this.data[`${zoom},${coord.x},${coord.y}`][time]) {
          this.data[`${zoom},${coord.x},${coord.y}`][time] = {
            latitude: [],
            longitude: [],
            weight: [],
            x: [],
            y: [],
            series: []
          }
        }
        let timestamp = this.data[`${zoom},${coord.x},${coord.y}`][time];
        timestamp.latitude.push(data.latitude[i]);
        timestamp.longitude.push(data.longitude[i]);
        timestamp.weight.push(data.weight[i]);
        timestamp.x.push(~~xcoords.x);
        timestamp.y.push(~~xcoords.y);
        timestamp.series.push(data.series[i]);

      }
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
      return null;
    }
    return {x: x, y: y};
  }

  getTile(coord, zoom, ownerDocument) {

    var canvas = this._getCanvas(coord, zoom, ownerDocument);
    let coordRec = this.getNormalizedCoord(coord, zoom);
    var zoomDiff = zoom + 8 - Math.min(zoom + 8, 16);
    if (coordRec) {
      new PelagosClient().obtainTile(url + `${zoom},${coordRec.x},${coordRec.y}`).then(function (data) {
        this.drawTile(canvas, zoom, data, coordRec, zoomDiff, this.filters);
      }.bind(this));
    }

    return canvas;
  }
}

export default CanvasLayer;
