import PelagosClient from "../../lib/pelagosClient";

const url = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/'
const DAY_MS = 24 * 60 * 60 * 1000;

class CanvasLayer {
  constructor(position, options, map, token, filters) {
    this.map = map;
    this.playbackData = {};
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
    this.playbackData = {};
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

  regenerate() {
    let tileIDArray = Object.keys(this.playbackData);
    for (let tileIdIndex = 0, length = tileIDArray.length; tileIdIndex < length; tileIdIndex++) {
      let tileID = tileIDArray[tileIdIndex]
      let timestampArray = Object.keys(this.playbackData[tileID]);
      for (let timestampIndex = 0, lengthTime = timestampArray.length; timestampIndex < lengthTime; timestampIndex++) {
        let timestamp = timestampArray[timestampIndex]
        let canvas = document.getElementById(tileID);
        let playbackData = this.playbackData[tileID][timestamp];
        this.drawTileFromPlaybackData(canvas, playbackData, true);
      }
    }
  }

  /**
   * Draws a single frame during playback mode
   *
   * @param pos
   */
  drawFrame(pos) {
    let canvasKeys = Object.keys(this.playbackData);
    for (let i = 0, length = canvasKeys.length; i < length; i++) {
      if (this.playbackData[canvasKeys[i]] && this.playbackData[canvasKeys[i]][pos]) {
        let playbackData = this.playbackData[canvasKeys[i]][pos];
        let canvas = document.getElementById(canvasKeys[i]);
        this.drawTileFromPlaybackData(canvas, playbackData, false);
      }
    }
  }

  /**
   * Draws a tile during playback mode
   *
   * @param idCanvas
   * @param playbackData
   * @param accumulative
   */
  drawTileFromPlaybackData(canvas, playbackData, accumulative) {
    if (!canvas) return;
    let filters = this.filters;
    if (!accumulative) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    let size = canvas.zoom > 6 ? 3 : 2;

    for (let j = 0, lengthData = playbackData.latitude.length; j < lengthData; j++) {
      if (!!filters) {
        if (filters.hasOwnProperty('flag') && (filters.flag.length > 0) && (playbackData.series[j] % 210 != filters.flag)) {
          continue;
        }
      }
      this.drawVesselPoint(canvas, playbackData.x[j], playbackData.y[j], size, playbackData.weight[j], true);
    }
  }

  drawTileFromVectorArray(canvas, vectorArray) {
    if (!canvas) return;
    let filters = this.filters;
    if (!vectorArray) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    let size = canvas.zoom > 6 ? 3 : 2;

    for (let i = 0, length = vectorArray.latitude.length; i < length; i++) {
      if (!!filters) {
        if (filters.hasOwnProperty('timeline') && ((vectorArray.datetime[i] < filters.timeline[0] || vectorArray.datetime[i] > filters.timeline[1]) || !vectorArray.weight[i])) {
          continue;
        }
        if (filters.hasOwnProperty('flag') && (filters.flag.length > 0) && (vectorArray.series[i] % 210 != filters.flag)) {
          continue;
        }
      }
      this.drawVesselPoint(canvas, vectorArray.x[i], vectorArray.y[i], size, vectorArray.weight[i], false);
    }
  }

  /**
   * Add projected lat/long values as x/y coordinates
   */
  addTileCoordinates(tileCoordinates, vectorArray) {
    const overlayProjection = this.map.getProjection();
    const scale = 1 << tileCoordinates.zoom;
    const tile_base_x = tileCoordinates.x * 256;
    const tile_base_y = tileCoordinates.y * 256;
    let zoomDiff = tileCoordinates.zoom + 8 - Math.min(tileCoordinates.zoom + 8, 16);

    vectorArray.x = new Int32Array(vectorArray.latitude.length);
    vectorArray.y = new Int32Array(vectorArray.latitude.length);

    for (let index = 0; index < vectorArray.latitude.length; index++) {
      let pointLatLong = overlayProjection.fromLatLngToPoint(new google.maps.LatLng(vectorArray.latitude[index], vectorArray.longitude[index]));

      const pointCoordinates = new google.maps.Point(
        Math.floor(pointLatLong.x * scale),
        Math.floor(pointLatLong.y * scale)
      );

      vectorArray.x[index] = ~~((pointCoordinates.x - tile_base_x) << zoomDiff);
      vectorArray.y[index] = ~~((pointCoordinates.y - tile_base_y) << zoomDiff);
    }
    return vectorArray;
  }

  storeAsPlaybackData(vectorArray, tileCoordinates) {
    let tileID = this.getTileID(tileCoordinates.x, tileCoordinates.y, tileCoordinates.zoom);

    if (!this.playbackData[tileID]) {
      this.playbackData[tileID] = {};
    } else {
      return;
    }

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      let time = vectorArray.datetime[index] - (vectorArray.datetime[index] % DAY_MS);

      if (!this.playbackData[tileID][time]) {
        this.playbackData[tileID][time] = {
          latitude: [],
          longitude: [],
          weight: [],
          x: [],
          y: [],
          series: [],
          seriesgroup: []
        }
      }
      let timestamp = this.playbackData[tileID][time];
      timestamp.latitude.push(vectorArray.latitude[index]);
      timestamp.longitude.push(vectorArray.longitude[index]);
      timestamp.weight.push(vectorArray.weight[index]);
      timestamp.x.push(vectorArray.x[index]);
      timestamp.y.push(vectorArray.y[index]);
      timestamp.series.push(vectorArray.series[index]);
      timestamp.seriesgroup.push(vectorArray.seriesgroup[index]);
    }
  }

  drawVesselPoint(canvas, x, y, size, weight, trail) {
    let calculatedWeight = Math.min(weight / 5, 1);

    canvas.ctx.fillStyle = 'rgba(17,129,251,' + calculatedWeight + ')';
    canvas.ctx.fillRect(x, y, size, size);

    if (calculatedWeight > 0.5) {
      canvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      canvas.ctx.fillRect(x + 1, y, size + 1, size + 1);
      canvas.ctx.fillRect(x + 1, y + 1, size + 1, size + 1);
      canvas.ctx.fillRect(x - 1, y, size + 1, size + 1);
      canvas.ctx.fillRect(x - 1, y - 1, size + 1, size + 1);
    }

    if (trail) {
      canvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      canvas.ctx.fillRect(x + 2, y + 1, size, size);
      canvas.ctx.fillRect(x + 2, y + 2, size, size);
      canvas.ctx.fillRect(x - 2, y - 1, size, size);
      canvas.ctx.fillRect(x - 2, y - 2, size, size);
    }
  }

  /**
   * Generates tile coordinates in x/y/zoom
   *
   * @param coord
   * @param zoom
   * @returns {*}
   */
  getTileCoordinates(coord, zoom) {
    let y = coord.y;
    let x = coord.x;
    const tileRange = 1 << zoom;
    if (y < 0 || y >= tileRange) {
      return null;
    }
    if (x < 0 || x >= tileRange) {
      return null;
    }
    return {x: x, y: y, zoom: zoom};
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
  getTemporalTileURLs(tileCoordinates, filters) {
    let startYear = new Date(filters.timeline[0]).getUTCFullYear();
    let endYear = new Date(filters.timeline[1]).getUTCFullYear();
    let urls = [];
    for (let i = startYear; i <= endYear; i++) {
      urls.push(`${url}${i}-01-01T00:00:00.000Z,${i + 1}-01-01T00:00:00.000Z;${tileCoordinates.zoom},${tileCoordinates.x},${tileCoordinates.y}`);
    }
    return urls;
  }

  groupData(vectorArray) {
    if (vectorArray && vectorArray.length > 1) {
      for (let i = 1, length = vectorArray.length; i < length; i++) {
        if (vectorArray[i] !== null) {
          if (i === 1) {
            vectorArray[0].category = Array.prototype.slice.call(vectorArray[0].category).concat(Array.prototype.slice.call(vectorArray[i].category));
            vectorArray[0].datetime = Array.prototype.slice.call(vectorArray[0].datetime).concat(Array.prototype.slice.call(vectorArray[i].datetime));
            vectorArray[0].latitude = Array.prototype.slice.call(vectorArray[0].latitude).concat(Array.prototype.slice.call(vectorArray[i].latitude));
            vectorArray[0].longitude = Array.prototype.slice.call(vectorArray[0].longitude).concat(Array.prototype.slice.call(vectorArray[i].longitude));
            vectorArray[0].series = Array.prototype.slice.call(vectorArray[0].series).concat(Array.prototype.slice.call(vectorArray[i].series));
            vectorArray[0].seriesgroup = Array.prototype.slice.call(vectorArray[0].seriesgroup).concat(Array.prototype.slice.call(vectorArray[i].seriesgroup));
            vectorArray[0].sigma = Array.prototype.slice.call(vectorArray[0].sigma).concat(Array.prototype.slice.call(vectorArray[i].sigma));
            vectorArray[0].weight = Array.prototype.slice.call(vectorArray[0].weight).concat(Array.prototype.slice.call(vectorArray[i].weight));
          } else {
            vectorArray[0].category = vectorArray[0].category.concat(Array.prototype.slice.call(vectorArray[i].category));
            vectorArray[0].datetime = vectorArray[0].datetime.concat(Array.prototype.slice.call(vectorArray[i].datetime));
            vectorArray[0].latitude = vectorArray[0].latitude.concat(Array.prototype.slice.call(vectorArray[i].latitude));
            vectorArray[0].longitude = vectorArray[0].longitude.concat(Array.prototype.slice.call(vectorArray[i].longitude));
            vectorArray[0].series = vectorArray[0].series.concat(Array.prototype.slice.call(vectorArray[i].series));
            vectorArray[0].seriesgroup = vectorArray[0].seriesgroup.concat(Array.prototype.slice.call(vectorArray[i].seriesgroup));
            vectorArray[0].sigma = vectorArray[0].sigma.concat(Array.prototype.slice.call(vectorArray[i].sigma));
            vectorArray[0].weight = vectorArray[0].weight.concat(Array.prototype.slice.call(vectorArray[i].weight));
          }
        }
      }
    }
    return vectorArray[0];
  }

  getTile(coord, zoom, ownerDocument) {
    var canvas = this._getCanvas(coord, zoom, ownerDocument);
    let tileCoordinates = this.getTileCoordinates(coord, zoom);
    let promises = [];
    if (tileCoordinates) {
      let urls = this.getTemporalTileURLs(tileCoordinates, this.filters);
      for (let i = 0, length = urls.length; i < length; i++) {
        promises.push(new PelagosClient().obtainTile(urls[i], this.token));
      }
    }
    Promise.all(promises).then(function (rawTileData) {
      let vectorArray = this.addTileCoordinates(tileCoordinates, this.groupData(rawTileData));
      this.drawTileFromVectorArray(canvas, vectorArray, tileCoordinates);
      this.storeAsPlaybackData(vectorArray, tileCoordinates);
    }.bind(this))

    return canvas;
  }
}

export default CanvasLayer;
