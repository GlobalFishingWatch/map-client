import PelagosClient from "../../lib/pelagosClient";
import {TIMELINE_STEP} from "../../constants";

const url = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/'

class CanvasLayer {
  constructor(position, options, map, token, filters, vesselLayerDensity) {
    this.map = map;
    this.playbackData = {};
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.visible = false;
    this.filters = filters || {};
    this.token = token;
    this.vesselLayerDensity = vesselLayerDensity;
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

  getTileId(x, y, z) {
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
    canvas.id = this.getTileId(coord.x, coord.y, zoom);

    // prepare canvas and context sizes
    var ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }

  /**
   * Draws a single frame during playback mode
   *
   * @param timestamp
   */
  drawTimeRange(start, end) {
    let canvasKeys = Object.keys(this.playbackData);
    for (let index = 0, length = canvasKeys.length; index < length; index++) {

      let canvasKey = canvasKeys[index];
      let canvas = document.getElementById(canvasKeys[index]);
      if (!canvas) {
        return;
      }
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let timestamp = start; timestamp < end; timestamp += TIMELINE_STEP) {

        if (this.playbackData[canvasKey] && this.playbackData[canvasKey][timestamp]) {
          let playbackData = this.playbackData[canvasKey][timestamp];
          this.drawTileFromPlaybackData(canvas, playbackData, false);
        }
      }
    }
  }

  /**
   * Draws a tile using playback data
   *
   * @param idCanvas
   * @param playbackData
   * @param drawTrail
   */
  drawTileFromPlaybackData(canvas, playbackData, drawTrail) {
    if (!canvas) return;
    let filters = this.filters;
    let size = canvas.zoom > 6 ? 3 : 2;

    for (let index = 0, lengthData = playbackData.latitude.length; index < lengthData; index++) {
      if (!!filters) {
        if (filters.hasOwnProperty('flag') && (filters.flag.length > 0) && (playbackData.series[index] % 210 != filters.flag)) {
          continue;
        }
      }
      this.drawVesselPoint(canvas, playbackData.x[index], playbackData.y[index], size, playbackData.weight[index], drawTrail);
    }
  }

  /**
   * Draws a tile using VectorArray data
   *
   * @param canvas
   * @param vectorArray
   * @param drawTrail
   */
  drawTileFromVectorArray(canvas, vectorArray, drawTrail) {
    if (!canvas) return;
    let filters = this.filters;
    if (!vectorArray) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    let size = canvas.zoom > 6 ? 3 : 2;

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      if (!!filters) {
        if (filters.hasOwnProperty('timeline') && ((vectorArray.datetime[index] < filters.timeline[0] || vectorArray.datetime[index] > filters.timeline[1]) || !vectorArray.weight[index])) {
          continue;
        }
        if (filters.hasOwnProperty('flag') && (filters.flag.length > 0) && (vectorArray.series[index] % 210 != filters.flag)) {
          continue;
        }
      }
      this.drawVesselPoint(canvas, vectorArray.x[index], vectorArray.y[index], size, vectorArray.weight[index], drawTrail);
    }
  }

  /**
   * Add projected lat/long values as x/y coordinates
   */
  addTileCoordinates(tileCoordinates, vectorArray) {
    const overlayProjection = this.map.getProjection();
    const scale = 1 << tileCoordinates.zoom;
    const tileBaseX = tileCoordinates.x * 256;
    const tileBaseY = tileCoordinates.y * 256;
    let zoomDiff = tileCoordinates.zoom + 8 - Math.min(tileCoordinates.zoom + 8, 16);

    vectorArray.x = new Int32Array(vectorArray.latitude.length);
    vectorArray.y = new Int32Array(vectorArray.latitude.length);

    for (let index = 0; index < vectorArray.latitude.length; index++) {
      let pointLatLong = overlayProjection.fromLatLngToPoint(new google.maps.LatLng(vectorArray.latitude[index], vectorArray.longitude[index]));

      const pointCoordinates = new google.maps.Point(
        Math.floor(pointLatLong.x * scale),
        Math.floor(pointLatLong.y * scale)
      );

      vectorArray.x[index] = ~~((pointCoordinates.x - tileBaseX) << zoomDiff);
      vectorArray.y[index] = ~~((pointCoordinates.y - tileBaseY) << zoomDiff);
    }
    return vectorArray;
  }

  /**
   * Converts Vector Array data to Playback format and stores it locally
   * @param vectorArray
   * @param tileCoordinates
   */
  storeAsPlaybackData(vectorArray, tileCoordinates) {
    let tileId = this.getTileId(tileCoordinates.x, tileCoordinates.y, tileCoordinates.zoom);

    if (!this.playbackData[tileId]) {
      this.playbackData[tileId] = {};
    } else {
      return;
    }

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      let time = vectorArray.datetime[index] - (vectorArray.datetime[index] % TIMELINE_STEP);

      if (!this.playbackData[tileId][time]) {
        this.playbackData[tileId][time] = {
          latitude: [],
          longitude: [],
          weight: [],
          x: [],
          y: [],
          series: [],
          seriesgroup: []
        }
      }
      let timestamp = this.playbackData[tileId][time];
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
    let vesselLayerDensity = this.vesselLayerDensity
    let calculatedWeight = Math.min(weight / vesselLayerDensity, 1);

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
      for (let index = 1, length = vectorArray.length; index < length; index++) {
        if (vectorArray[index] !== null) {
          if (index === 1) {
            vectorArray[0].category = Array.prototype.slice.call(vectorArray[0].category).concat(Array.prototype.slice.call(vectorArray[index].category));
            vectorArray[0].datetime = Array.prototype.slice.call(vectorArray[0].datetime).concat(Array.prototype.slice.call(vectorArray[index].datetime));
            vectorArray[0].latitude = Array.prototype.slice.call(vectorArray[0].latitude).concat(Array.prototype.slice.call(vectorArray[index].latitude));
            vectorArray[0].longitude = Array.prototype.slice.call(vectorArray[0].longitude).concat(Array.prototype.slice.call(vectorArray[index].longitude));
            vectorArray[0].series = Array.prototype.slice.call(vectorArray[0].series).concat(Array.prototype.slice.call(vectorArray[index].series));
            vectorArray[0].seriesgroup = Array.prototype.slice.call(vectorArray[0].seriesgroup).concat(Array.prototype.slice.call(vectorArray[index].seriesgroup));
            vectorArray[0].sigma = Array.prototype.slice.call(vectorArray[0].sigma).concat(Array.prototype.slice.call(vectorArray[index].sigma));
            vectorArray[0].weight = Array.prototype.slice.call(vectorArray[0].weight).concat(Array.prototype.slice.call(vectorArray[index].weight));
          } else {
            vectorArray[0].category = vectorArray[0].category.concat(Array.prototype.slice.call(vectorArray[index].category));
            vectorArray[0].datetime = vectorArray[0].datetime.concat(Array.prototype.slice.call(vectorArray[index].datetime));
            vectorArray[0].latitude = vectorArray[0].latitude.concat(Array.prototype.slice.call(vectorArray[index].latitude));
            vectorArray[0].longitude = vectorArray[0].longitude.concat(Array.prototype.slice.call(vectorArray[index].longitude));
            vectorArray[0].series = vectorArray[0].series.concat(Array.prototype.slice.call(vectorArray[index].series));
            vectorArray[0].seriesgroup = vectorArray[0].seriesgroup.concat(Array.prototype.slice.call(vectorArray[index].seriesgroup));
            vectorArray[0].sigma = vectorArray[0].sigma.concat(Array.prototype.slice.call(vectorArray[index].sigma));
            vectorArray[0].weight = vectorArray[0].weight.concat(Array.prototype.slice.call(vectorArray[index].weight));
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
      for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
        promises.push(new PelagosClient().obtainTile(urls[urlIndex], this.token));
      }
    }
    Promise.all(promises).then(function (rawTileData) {
      if (tileCoordinates) {
        let vectorArray = this.addTileCoordinates(tileCoordinates, this.groupData(rawTileData));
        this.drawTileFromVectorArray(canvas, vectorArray, tileCoordinates);
        this.storeAsPlaybackData(vectorArray, tileCoordinates);
      }
    }.bind(this))

    return canvas;
  }
}

export default CanvasLayer;
