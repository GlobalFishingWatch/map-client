import PelagosClient from "../../lib/pelagosClient";

const url = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/'
const DAY_MS = 24 * 60 * 60 * 1000;

class CanvasLayer {
  constructor(position, options, map, token, filters) {
    this.map = map;
    this.data = {};
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.visible = false;
    this.filters = filters || {};
    this.token = token;
  }

  hide() {
    if (this.visible) {
      this.visible = false;
      this.map.overlayMapTypes.removeAt(this.position);
    }
  }

  show() {
    if (!this.visible) {
      this.visible = true;
      this.map.overlayMapTypes.insertAt(this.position, this);
    }
  }

  getTileID(x, y, z) {
    return (x * 1000000000) + (y * 100) + z
  }

  isVisible() {
    return this.visible;
  }

  applyFilters(filters) {
    if (filters) {
      this.filters = filters;
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
    canvas.id = this.getTileID(coord.x, coord.y, zoom);

    // prepare canvas and context sizes
    var ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }

  drawFrame(pos) {
    let canvasKeys = Object.keys(this.data);
    for (let i = 0, length = canvasKeys.length; i < length; i++) {
      if (this.data[canvasKeys[i]] && this.data[canvasKeys[i]][pos]) {
        let data = this.data[canvasKeys[i]][pos];
        this.drawDynamicTile(canvasKeys[i], data, false);
      }
    }
  }

  /**
   * Draws tiles during playback mode
   *
   * @param idCanvas
   * @param data
   * @param accumulative
   */
  drawDynamicTile(idCanvas, data, accumulative) {
    let canvas = document.getElementById(idCanvas);
    if (!canvas) return;
    let filters = this.filters;
    if (!accumulative) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    let size = this.map.getZoom() > 6 ? 3 : 2 || 1;
    for (let j = 0, lengthData = data.latitude.length; j < lengthData; j++) {
      if (!!filters) {
        if (filters.hasOwnProperty('flag') && (filters.flag.length > 0) && (data.series[j] % 210 != filters.flag)) {
          continue;
        }
      }
      this.drawVesselPoint(canvas, data.x[j], data.y[j], size, data.weight[j]);
      canvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      canvas.ctx.fillRect(~~data.x[j] + 2, ~~data.y[j] + 1, size, size);
      canvas.ctx.fillRect(~~data.x[j] + 2, ~~data.y[j] + 2, size, size);
      canvas.ctx.fillRect(~~data.x[j] - 2, ~~data.y[j] - 1, size, size);
      canvas.ctx.fillRect(~~data.x[j] - 2, ~~data.y[j] - 2, size, size);
    }
  }

  regenerate() {
    let canvasKeys = Object.keys(this.data);
    for (let i = 0, length = canvasKeys.length; i < length; i++) {
      let times = Object.keys(this.data[canvasKeys[i]]);
      for (let j = 0, lengthTime = times.length; j < lengthTime; j++) {
        this.drawDynamicTile(canvasKeys[i], this.data[canvasKeys[i]][times[j]], true);
      }
    }
  }

  drawStaticTile(canvas, zoom, data, coord, zoom_diff) {
    let filters = this.filters;

    if (!data) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    
    let tileID = this.getTileID(coord.x, coord.y, zoom);
    let parseData = false;
    if (!this.data[tileID]) {
      parseData = true;
      this.data[tileID] = {};
    }
    const overlayProjection = this.map.getProjection();
    const scale = 1 << zoom;
    const tile_base_x = coord.x * 256;
    const tile_base_y = coord.y * 256;

    let size = zoom > 6
      ? 3
      : 2 || 1;
    for (let i = 0, length = data.latitude.length; i < length; i++) {

      if (!!filters) {
        if (filters.hasOwnProperty('timeline') && ((data.datetime[i] < filters.timeline[0] || data.datetime[i] > filters.timeline[1]) || !data.weight[i])) {
          continue;
        }
        if (filters.hasOwnProperty('flag') && (filters.flag.length > 0) && (data.series[i] % 210 != filters.flag)) {
          continue;
        }
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
      this.drawVesselPoint(canvas, xcoords.x, xcoords.y, size, data.weight[i]);
      if (parseData) {
        this.extractData(data, i,  xcoords, tileID);
      }
    }
  }

  extractData(data, i, coords, tileID) {
    let time = data.datetime[i] - (data.datetime[i] % DAY_MS);
    if (!this.data[tileID][time]) {
      this.data[tileID][time] = {
        latitude: [],
        longitude: [],
        weight: [],
        x: [],
        y: [],
        series: [],
        seriesgroup: []
      }
    }
    let timestamp = this.data[tileID][time];
    timestamp.latitude.push(data.latitude[i]);
    timestamp.longitude.push(data.longitude[i]);
    timestamp.weight.push(data.weight[i]);
    timestamp.x.push(~~coords.x);
    timestamp.y.push(~~coords.y);
    timestamp.series.push(data.series[i]);
    timestamp.seriesgroup.push(data.seriesgroup[i]);
    return {time: time, timestamp: timestamp};
  }

  drawVesselPoint(canvas, x, y, size, weight) {
    let calculatedWeight = Math.min(weight / 5, 1);
    let roundedX = ~~x;
    let roundedY = ~~y;

    canvas.ctx.fillStyle = 'rgba(17,129,251,' + calculatedWeight + ')';
    canvas.ctx.fillRect(roundedX, roundedY, size, size);

    if (calculatedWeight > 0.5) {
      canvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      canvas.ctx.fillRect(roundedX + 1, roundedY, size + 1, size + 1);
      canvas.ctx.fillRect(roundedX + 1, roundedY + 1, size + 1, size + 1);
      canvas.ctx.fillRect(roundedX - 1, roundedY, size + 1, size + 1);
      canvas.ctx.fillRect(roundedX - 1, roundedY - 1, size + 1, size + 1);
    }
  }

  getNormalizedCoord(coord, zoom) {
    let y = coord.y;
    let x = coord.x;
    const tileRange = 1 << zoom;
    if (y < 0 || y >= tileRange) {
      return null;
    }
    if (x < 0 || x >= tileRange) {
      return null;
    }
    return {x: x, y: y};
  }

  /**
   * Generates the URLs to load vessel track data
   *
   * @param zoom
   * @param x
   * @param y
   * @param filters
   * @returns {Array}
   */
  getTemporalTileURLs(zoom, x, y, filters) {
    let startYear = new Date(filters.timeline[0]).getUTCFullYear();
    let endYear = new Date(filters.timeline[1]).getUTCFullYear();
    let urls = [];
    for (let i = startYear; i <= endYear; i++) {
      urls.push(`${url}${i}-01-01T00:00:00.000Z,${i + 1}-01-01T00:00:00.000Z;${zoom},${x},${y}`);
    }
    return urls;
  }

  groupData(data) {
    if (data && data.length > 1) {
      for (let i = 1, length = data.length; i < length; i++) {
        if (data[i] !== null) {
          if (i === 1) {
            data[0].category = Array.prototype.slice.call(data[0].category).concat(Array.prototype.slice.call(data[i].category));
            data[0].datetime = Array.prototype.slice.call(data[0].datetime).concat(Array.prototype.slice.call(data[i].datetime));
            data[0].latitude = Array.prototype.slice.call(data[0].latitude).concat(Array.prototype.slice.call(data[i].latitude));
            data[0].longitude = Array.prototype.slice.call(data[0].longitude).concat(Array.prototype.slice.call(data[i].longitude));
            data[0].series = Array.prototype.slice.call(data[0].series).concat(Array.prototype.slice.call(data[i].series));
            data[0].seriesgroup = Array.prototype.slice.call(data[0].seriesgroup).concat(Array.prototype.slice.call(data[i].seriesgroup));
            data[0].sigma = Array.prototype.slice.call(data[0].sigma).concat(Array.prototype.slice.call(data[i].sigma));
            data[0].weight = Array.prototype.slice.call(data[0].weight).concat(Array.prototype.slice.call(data[i].weight));
          } else {
            data[0].category = data[0].category.concat(Array.prototype.slice.call(data[i].category));
            data[0].datetime = data[0].datetime.concat(Array.prototype.slice.call(data[i].datetime));
            data[0].latitude = data[0].latitude.concat(Array.prototype.slice.call(data[i].latitude));
            data[0].longitude = data[0].longitude.concat(Array.prototype.slice.call(data[i].longitude));
            data[0].series = data[0].series.concat(Array.prototype.slice.call(data[i].series));
            data[0].seriesgroup = data[0].seriesgroup.concat(Array.prototype.slice.call(data[i].seriesgroup));
            data[0].sigma = data[0].sigma.concat(Array.prototype.slice.call(data[i].sigma));
            data[0].weight = data[0].weight.concat(Array.prototype.slice.call(data[i].weight));
          }
        }
      }
    }
    return data[0];
  }

  getTile(coord, zoom, ownerDocument) {
    var canvas = this._getCanvas(coord, zoom, ownerDocument);
    let normalizedCoord = this.getNormalizedCoord(coord, zoom);
    var zoomDiff = zoom + 8 - Math.min(zoom + 8, 16);
    let promises = [];
    if (normalizedCoord) {
      let urls = this.getTemporalTileURLs(zoom, normalizedCoord.x, normalizedCoord.y, this.filters);
      for (let i = 0, length = urls.length; i < length; i++) {
        promises.push(new PelagosClient().obtainTile(urls[i], this.token));
      }
    }
    Promise.all(promises).then(function (data) {
      let dataGroup = this.groupData(data);
      this.drawStaticTile(canvas, zoom, dataGroup, normalizedCoord, zoomDiff);
    }.bind(this))

    return canvas;
  }
}

export default CanvasLayer;
