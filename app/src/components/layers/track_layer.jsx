import PelagosClient from "../../lib/pelagosClient";
import {TIMELINE_STEP} from "../../constants";

const url = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/'

class TrackLayer {
  constructor(position, map, token, filters, vesselLayerTransparency, visible, seriesGroup) {
    this.map = map;
    this.playbackData = {};
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.visible = false;
    this.filters = filters || {};
    this.token = token;
    this.vesselLayerTransparency = vesselLayerTransparency;
    if (visible) {
      this.show()
    }
    this.seriesGroup = seriesGroup;
  }

  /**
   * Hides the layer
   */
  hide() {
    if (!this.visible) {
      return;
    }
    this.visible = false;
    this.map.overlayMapTypes.removeAt(this.position);
  }

  /**
   * Shows the layer
   */
  show() {
    if (this.visible) {
      return;
    }
    this.visible = true;
    this.map.overlayMapTypes.insertAt(this.position, this);
  }

  /**
   * Forces a redraw of the layer
   */
  refresh() {
    if (this.visible) {
      this.map.overlayMapTypes.removeAt(this.position);
      this.map.overlayMapTypes.insertAt(this.position, this);
    }
  }

  /**
   * Calculates a tile ID/key based on their x/y/zoom coordinates
   *
   * @param x
   * @param y
   * @param z
   * @returns {*}
     */
  getTileId(x, y, z) {
    return 'foo'
  }

  isVisible() {
    return this.visible;
  }

  /**
   * Updates the filters info
   * Clears playback data and redraws the layer
   *
   * @param filters
   */
  updateFilters(filters) {
    this.filters = filters;
    this.resetPlaybackData();
    this.refresh();
  }

  /**
   * Resets playback data
   */
  resetPlaybackData() {
    this.playbackData = {};
  }

  /**
   * Creates a canvas element
   *
   * @param coord
   * @param zoom
   * @param ownerDocument
   * @returns {*}
   * @private
   */
  _getCanvas(coord, zoom, ownerDocument) {
    // create canvas and reset style
    var canvas = ownerDocument.createElement('canvas');
    canvas.style.border = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.id = this.getTileId();

    // prepare canvas and context sizes
    var ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }

  /**
   * Given a series number, returns all matching points
   * TODO: can probably be removed once the tracks are being drawn with the correct, detail data
   *
   * @param series
   * @returns {Array}
   */
  getAllPositionsBySeries(series) {
    const tiles = this.playbackData;
    let positions = [];

    for (var tile in tiles) {
      for (var timestamp in tiles[tile]) {
        for (var index = 0; index < tiles[tile][timestamp].latitude.length; index++) {
          if (tiles[tile][timestamp].series[index] == series) {
            positions.push({
              'lat': tiles[tile][timestamp].latitude[index],
              'lng': tiles[tile][timestamp].longitude[index]
            });
          }
        }
      }
    }
    return positions;
  }

  /**
   * Loads the first matching vessel for the given lat/long pair
   * TODO: return and handle multiple vessels on the same coordinates
   *
   * @param lat
   * @param long
   * @returns {{latitude, longitude, weight, timestamp: *, x: *, y: *, series, seriesgroup}}
   */
  getVesselAtLocation(lat, long) {
    const filters = this.filters;
    const tiles = this.playbackData;
    for (var tileId in tiles) {
      for (var timestamp = filters.startDate; timestamp <= filters.endDate; timestamp += TIMELINE_STEP) {
        if (!tiles[tileId].hasOwnProperty(timestamp)) {
          continue;
        }
        for (var i = 0; i < tiles[tileId][timestamp].latitude.length; i++) {
          if (~~tiles[tileId][timestamp].latitude[i] == lat && ~~tiles[tileId][timestamp].longitude[i] == long) {
            return {
              latitude: tiles[tileId][timestamp].latitude[i],
              longitude: tiles[tileId][timestamp].longitude[i],
              weight: tiles[tileId][timestamp].weight[i],
              timestamp: timestamp,
              x: tiles[tileId][timestamp].x[i],
              y: tiles[tileId][timestamp].y[i],
              series: tiles[tileId][timestamp].series[i],
              seriesgroup: tiles[tileId][timestamp].seriesgroup[i]
            }
          }
        }
      }
    }
  }

  /**
   * Draws all data in between the given start and end times
   *
   *
   * @param start
   * @param end
   */
  drawTimeRange(start, end) {
    const canvasKeys = Object.keys(this.playbackData);
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
    const size = canvas.zoom > 6 ? 3 : 2;

    for (let index = 0, lengthData = playbackData.latitude.length; index < lengthData; index++) {
      this.drawVesselPoint(canvas, playbackData.x[index], playbackData.y[index], size, playbackData.weight[index], drawTrail);
    }
  }

  /**
   * Draws a tile using VectorArray data
   * Used only immediately after data is loaded.
   *
   * @see drawTileFromPlaybackData
   *
   * @param canvas
   * @param vectorArray
   * @param drawTrail
   */
  drawTileFromVectorArray(canvas, vectorArray) {
    if (!canvas) return;

    const filters = this.filters;
    if (!vectorArray) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const size = canvas.zoom > 6 ? 3 : 2;

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      if (!!filters) {
        if (filters.startDate && filters.endDate && ((vectorArray.datetime[index] < filters.startDate || vectorArray.datetime[index] > filters.endDate) || !vectorArray.weight[index])) {
          continue;
        }
        if (filters.flag != "" && (vectorArray.series[index] % 210 != filters.flag)) {
          continue;
        }
      }
      this.drawVesselPoint(canvas, vectorArray.x[index], vectorArray.y[index], size, vectorArray.weight[index], false);
    }
  }

  /**
   * Validates if the vessel point matches the current filter state
   *
   * @param data
   * @param index
   * @returns {boolean}
   */
  passesFilters(data, index) {
    const filters = this.filters;
    if (!!filters) {
      if (filters.startDate && filters.endDate && ((data.datetime[index] < filters.startDate || data.datetime[index] > filters.endDate) || !data.weight[index])) {
        return false;
      }
      if (filters.flag != "" && (data.series[index] % 210 != filters.flag)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Add projected lat/long values transformed as x/y coordinates
   */
  addTileCoordinates(tileCoordinates, vectorArray) {
    const overlayProjection = this.map.getProjection();
    const scale = 1 << tileCoordinates.zoom;
    const tileBaseX = tileCoordinates.x * 256;
    const tileBaseY = tileCoordinates.y * 256;
    const zoomDiff = tileCoordinates.zoom + 8 - Math.min(tileCoordinates.zoom + 8, 16);

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
   *
   * @param vectorArray
   * @param tileCoordinates
   */
  storeAsPlaybackData(vectorArray, tileCoordinates) {
    const tileId = this.getTileId();

    if (!this.playbackData[tileId]) {
      this.playbackData[tileId] = {};
    } else {
      return;
    }

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      if (!this.passesFilters(vectorArray, index)) {
        continue;
      }

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

  /**
   * Draws a single point representing a vessel
   *
   * @param canvas
   * @param x
   * @param y
   * @param size
   * @param weight
   * @param drawTrail
   */
  drawVesselPoint(canvas, x, y, size, weight, drawTrail) {
    const vesselLayerTransparency = this.vesselLayerTransparency
    const calculatedWeight = Math.min(weight / vesselLayerTransparency, 1);

    canvas.ctx.fillStyle = 'rgba(17,129,251,' + calculatedWeight + ')';
    canvas.ctx.fillRect(x, y, size, size);

    if (calculatedWeight > 0.5) {
      canvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      canvas.ctx.fillRect(x + 1, y, size + 1, size + 1);
      canvas.ctx.fillRect(x + 1, y + 1, size + 1, size + 1);
      canvas.ctx.fillRect(x - 1, y, size + 1, size + 1);
      canvas.ctx.fillRect(x - 1, y - 1, size + 1, size + 1);
    }

    if (drawTrail) {
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
    const y = coord.y;
    const x = coord.x;
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
   * TODO: clarify exactly what this does
   *
   * @param vectorArray
   * @returns {*}
   */
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

  /**
   * Generates the URLs to load vessel track data
   *
   * @param zoom
   * @param x
   * @param y
   * @param filters
   * @returns {Array}
   */
  getTemporalTileURLs(tileCoordinates, filters, series) {
    const startYear = new Date(filters.startDate).getUTCFullYear();
    const endYear = new Date(filters.endDate).getUTCFullYear();
    let urls = [];
    for (let i = startYear; i <= endYear; i++) {
      urls.push(`${url}${i}-01-01T00:00:00.000Z,${i + 1}-01-01T00:00:00.000Z;${tileCoordinates.zoom},${tileCoordinates.x},${tileCoordinates.y}`);
    }
    return urls;
  }


  /**
   * Creates and loads data for each tile
   *
   * @param coord
   * @param zoom
   * @param ownerDocument
   * @returns {*}
   */
  getTile(coord, zoom, ownerDocument) {

    const url = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/sub/seriesgroup=' + this.seriesGroup + '/2015-01-01T00:00:00.000Z,2016-01-01T00:00:00.000Z;1,1,1'
    const canvas = this._getCanvas(coord, zoom, ownerDocument);
    const tileCoordinates = this.getTileCoordinates(coord, zoom);
    let promises = [];
    if (tileCoordinates) {
        promises.push(new PelagosClient().obtainTile(url, this.token));
    }
    Promise.all(promises).then(function (rawTileData) {
      debugger;
      if (tileCoordinates && rawTileData[0]) {
        let vectorArray = this.addTileCoordinates(tileCoordinates, this.groupData(rawTileData));
        this.drawTileFromVectorArray(canvas, vectorArray);
        this.storeAsPlaybackData(vectorArray, tileCoordinates);
      }
    }.bind(this))

    return canvas;
  }
}

export default TrackLayer;
