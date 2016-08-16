/* eslint no-underscore-dangle:0 */
import PelagosClient from '../../lib/pelagosClient';
import { TIMELINE_STEP } from '../../constants';
import _ from 'lodash';

class CanvasLayer {
  constructor(position, map, token, filters, vesselTransparency, vesselColor, visible) {
    this.map = map;
    this.playbackData = {};
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.visible = false;
    this.filters = filters;
    this.token = token;
    this.vesselTransparency = vesselTransparency;
    this.setVesselColor(vesselColor);

    this.outerStartDate = filters.startDate;
    this.outerEndDate = filters.endDate;
    this.innerStartDate = filters.timelineInnerExtent[0];
    this.innerEndDate = filters.timelineInnerExtent[1];
    if (visible) {
      this.show();
    }
  }

  setVesselColor(vesselColor) {
    this.vesselColor = {
      r: parseInt(vesselColor.slice(1, 3), 16),
      g: parseInt(vesselColor.slice(3, 5), 16),
      b: parseInt(vesselColor.slice(5, 7), 16)
    };
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
      if (this.map.overlayMapTypes.getAt(this.position)) {
        this.map.overlayMapTypes.removeAt(this.position);
      }
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
    return (x * 1000000000) + (y * 100) + z;
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
    this.outerStartDate = filters.startDate;
    this.outerEndDate = filters.endDate;
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
    const canvas = ownerDocument.createElement('canvas');
    canvas.style.border = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.id = this.getTileId(coord.x, coord.y, zoom);

    // prepare canvas and context sizes
    const ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }

  /**
   * Loads the first matching vessel for the given lat/long pair
   * TODO: return and handle multiple vessels on the same coordinates
   *
   * @param lat
   * @param long
   */
  getVesselAtLocation(lat, long) {
    const filters = this.filters;
    const tiles = this.playbackData;

    const tileIds = Object.keys(tiles);
    for (let tileIdIndex = 0; tileIdIndex < tileIds.length; tileIdIndex++) {
      const tile = tiles[tileIds[tileIdIndex]];

      for (
        let currentTimestamp = filters.startDate;
        currentTimestamp <= filters.endDate;
        currentTimestamp += TIMELINE_STEP
      ) {
        if (!tile.hasOwnProperty(currentTimestamp)) {
          continue;
        }
        for (let i = 0; i < tile[currentTimestamp].latitude.length; i++) {
          if (~~tile[currentTimestamp].latitude[i] === lat && ~~tile[currentTimestamp].longitude[i] === long) {
            return {
              latitude: tile[currentTimestamp].latitude[i],
              longitude: tile[currentTimestamp].longitude[i],
              weight: tile[currentTimestamp].weight[i],
              timestamp: currentTimestamp,
              x: tile[currentTimestamp].x[i],
              y: tile[currentTimestamp].y[i],
              series: tile[currentTimestamp].series[i],
              seriesgroup: tile[currentTimestamp].seriesgroup[i]
            };
          }
        }
      }
    }
    return null;
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
    this.innerStartDate = CanvasLayer.getTimestampIndex(start);
    this.innerEndDate = CanvasLayer.getTimestampIndex(end);

    for (let index = 0, length = canvasKeys.length; index < length; index++) {
      const canvasKey = canvasKeys[index];
      const canvas = document.getElementById(canvasKeys[index]);
      if (!canvas) {
        return;
      }
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let timestamp = this.innerStartDate; timestamp < this.innerEndDate; timestamp += TIMELINE_STEP) {
        if (this.playbackData[canvasKey] && this.playbackData[canvasKey][timestamp]) {
          const playbackData = this.playbackData[canvasKey][timestamp];
          this.drawTileFromPlaybackData(canvas, playbackData, false);
        } else {
          // TODO: a lot of missing timestamp indexes here, check why
        }
      }
    }
  }

  /**
   * Draws a tile using playback data
   *
   * @param canvas
   * @param playbackData
   * @param drawTrail
   */
  drawTileFromPlaybackData(canvas, playbackData, drawTrail) {
    if (!canvas) {
      return;
    }
    const size = canvas.zoom > 6 ? 3 : 2;

    for (let index = 0, lengthData = playbackData.latitude.length; index < lengthData; index++) {
      this.drawVesselPoint(
        canvas,
        playbackData.x[index],
        playbackData.y[index],
        size,
        playbackData.weight[index],
        playbackData.sigma[index],
        drawTrail
      );
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
   */
  drawTileFromVectorArray(canvas, vectorArray) {
    if (!canvas) {
      return;
    }

    if (!vectorArray) {
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const size = canvas.zoom > 6 ? 3 : 2;

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      if (!this.passesFilters(vectorArray, index, true)) {
        continue;
      }
      this.drawVesselPoint(
        canvas,
        vectorArray.x[index],
        vectorArray.y[index],
        size,
        vectorArray.weight[index],
        vectorArray.sigma[index],
        false
      );
    }
  }

  /**
   * Validates if the vessel point matches the current filter state
   *
   * @param data
   * @param index
   * @param useInnerDateFilter
   * @returns {boolean}
   */
  passesFilters(data, index, useInnerDateFilter = false) {
    const filters = this.filters;
    if (!useInnerDateFilter && data.datetime[index] < this.outerStartDate) {
      return false;
    }
    if (!useInnerDateFilter && data.datetime[index] > this.outerEndDate) {
      return false;
    }
    if (useInnerDateFilter && data.datetime[index] < this.innerStartDate) {
      return false;
    }
    if (useInnerDateFilter && data.datetime[index] > this.innerEndDate) {
      return false;
    }
    if (!data.weight[index]) {
      return false;
    }
    if (!!filters) {
      if (filters.flag !== '' && data.category[index] !== parseInt(filters.flag, 10)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Add projected lat/long values transformed as x/y coordinates
   */
  addTileCoordinates(tileCoordinates, vectorArray) {
    const data = vectorArray;
    const overlayProjection = this.map.getProjection();
    const scale = 1 << tileCoordinates.zoom;
    const tileBaseX = tileCoordinates.x * 256;
    const tileBaseY = tileCoordinates.y * 256;
    const zoomDiff = tileCoordinates.zoom + 8 - Math.min(tileCoordinates.zoom + 8, 16);

    data.x = new Int32Array(data.latitude.length);
    data.y = new Int32Array(data.latitude.length);

    for (let index = 0; index < data.latitude.length; index++) {
      const pointLatLong = overlayProjection.fromLatLngToPoint(
        new google.maps.LatLng(data.latitude[index], data.longitude[index])
      );

      const pointCoordinates = new google.maps.Point(
        Math.floor(pointLatLong.x * scale),
        Math.floor(pointLatLong.y * scale)
      );

      data.x[index] = ~~((pointCoordinates.x - tileBaseX) << zoomDiff);
      data.y[index] = ~~((pointCoordinates.y - tileBaseY) << zoomDiff);
    }
    return data;
  }

  /**
   * Converts Vector Array data to Playback format and stores it locally
   *
   * @param vectorArray
   * @param tileCoordinates
   */
  storeAsPlaybackData(vectorArray, tileCoordinates) {
    const tileId = this.getTileId(tileCoordinates.x, tileCoordinates.y, tileCoordinates.zoom);

    if (!this.playbackData[tileId]) {
      this.playbackData[tileId] = {};
    } else {
      return;
    }

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      if (!this.passesFilters(vectorArray, index)) {
        continue;
      }

      const time = CanvasLayer.getTimestampIndex(vectorArray.datetime[index]);
      // using timestamps as array indexes might cause a performance issue
      // see sparse arrays/contiguous keys
      // http://www.html5rocks.com/en/tutorials/speed/v8/?redirect_from_locale=es
      if (!this.playbackData[tileId][time]) {
        this.playbackData[tileId][time] = {
          category: [],
          latitude: [],
          longitude: [],
          weight: [],
          x: [],
          y: [],
          series: [],
          seriesgroup: [],
          sigma: []
        };
      }
      const timestamp = this.playbackData[tileId][time];
      timestamp.category.push(vectorArray.category[index]);
      timestamp.latitude.push(vectorArray.latitude[index]);
      timestamp.longitude.push(vectorArray.longitude[index]);
      timestamp.weight.push(vectorArray.weight[index]);
      timestamp.x.push(vectorArray.x[index]);
      timestamp.y.push(vectorArray.y[index]);
      timestamp.series.push(vectorArray.series[index]);
      timestamp.seriesgroup.push(vectorArray.seriesgroup[index]);
      timestamp.sigma.push(vectorArray.sigma[index]);
    }
  }

  static getTimestampIndex(timestamp) {
    return timestamp - (timestamp % TIMELINE_STEP);
  }

  /**
   * Draws a single point representing a vessel
   *
   * @param canvas
   * @param x
   * @param y
   * @param size
   * @param weight
   * @param sigma
   * @param drawTrail
   */
  drawVesselPoint(canvas, x, y, size, weight, sigma, drawTrail) {
    const workCanvas = canvas;
    const vesselTransparency = this.vesselTransparency;
    const calculatedWeight = Math.min(weight / vesselTransparency, 1);

    workCanvas.ctx.fillStyle = `rgba(${this.vesselColor.r}\
,${this.vesselColor.g},${this.vesselColor.b},${calculatedWeight})`;
    workCanvas.ctx.fillRect(x, y, size, size);

    if (calculatedWeight > 0.5) {
      workCanvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      workCanvas.ctx.fillRect(x + 1, y, size + 1, size + 1);
      workCanvas.ctx.fillRect(x + 1, y + 1, size + 1, size + 1);
      workCanvas.ctx.fillRect(x - 1, y, size + 1, size + 1);
      workCanvas.ctx.fillRect(x - 1, y - 1, size + 1, size + 1);
    }

    if (drawTrail) {
      workCanvas.ctx.fillStyle = 'rgba(255,255,255,0.1)';
      workCanvas.ctx.fillRect(x + 2, y + 1, size, size);
      workCanvas.ctx.fillRect(x + 2, y + 2, size, size);
      workCanvas.ctx.fillRect(x - 2, y - 1, size, size);
      workCanvas.ctx.fillRect(x - 2, y - 2, size, size);
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
    return { x, y, zoom };
  }

  /**
   * Generates the URLs to load vessel track data
   *
   * @param tileCoordinates
   * @param startDate
   * @param endDate
   * @returns {Array}
   */
  getTemporalTileURLs(tileCoordinates, startDate, endDate) {
    const startYear = new Date(startDate).getUTCFullYear();
    const endYear = new Date(endDate).getUTCFullYear();
    const urls = [];
    for (let year = startYear; year <= endYear; year++) {
      urls.push(`${MAP_API_ENDPOINT}/v1/tilesets/tms-format-2015-2016-v1/\
${year}-01-01T00:00:00.000Z,${year + 1}-01-01T00:00:00.000Z;
${tileCoordinates.zoom},${tileCoordinates.x},${tileCoordinates.y}`);
    }
    return urls;
  }

  /**
   * TODO: clarify exactly what this does
   *
   * @param vectorArray
   * @returns {*}
   */
  groupData(vectorArray) {
    const data = vectorArray[0];
    if (vectorArray && vectorArray.length > 1) {
      for (let index = 1, length = vectorArray.length; index < length; index++) {
        if (vectorArray[index] !== null) {
          if (index === 1) {
            data.category = Array.prototype.slice.call(data.category).concat(
              Array.prototype.slice.call(vectorArray[index].category)
            );
            data.datetime = Array.prototype.slice.call(data.datetime).concat(
              Array.prototype.slice.call(vectorArray[index].datetime)
            );
            data.latitude = Array.prototype.slice.call(data.latitude).concat(
              Array.prototype.slice.call(vectorArray[index].latitude)
            );
            data.longitude = Array.prototype.slice.call(data.longitude).concat(
              Array.prototype.slice.call(vectorArray[index].longitude)
            );
            data.series = Array.prototype.slice.call(data.series).concat(
              Array.prototype.slice.call(vectorArray[index].series)
            );
            data.seriesgroup = Array.prototype.slice.call(data.seriesgroup).concat(
              Array.prototype.slice.call(vectorArray[index].seriesgroup)
            );
            data.sigma = Array.prototype.slice.call(data.sigma).concat(
              Array.prototype.slice.call(vectorArray[index].sigma)
            );
            data.weight = Array.prototype.slice.call(data.weight).concat(
              Array.prototype.slice.call(vectorArray[index].weight)
            );
          } else {
            data.category = data.category.concat(Array.prototype.slice.call(vectorArray[index].category));
            data.datetime = data.datetime.concat(Array.prototype.slice.call(vectorArray[index].datetime));
            data.latitude = data.latitude.concat(Array.prototype.slice.call(vectorArray[index].latitude));
            data.longitude = data.longitude.concat(Array.prototype.slice.call(vectorArray[index].longitude));
            data.series = data.series.concat(Array.prototype.slice.call(vectorArray[index].series));
            data.seriesgroup = data.seriesgroup.concat(Array.prototype.slice.call(vectorArray[index].seriesgroup));
            data.sigma = data.sigma.concat(Array.prototype.slice.call(vectorArray[index].sigma));
            data.weight = data.weight.concat(Array.prototype.slice.call(vectorArray[index].weight));
          }
        }
      }
    }
    return data;
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
    const canvas = this._getCanvas(coord, zoom, ownerDocument);
    const tileCoordinates = this.getTileCoordinates(coord, zoom);
    const promises = [];
    if (tileCoordinates) {
      const urls = this.getTemporalTileURLs(tileCoordinates, this.outerStartDate, this.outerEndDate);
      for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
        promises.push(new PelagosClient().obtainTile(urls[urlIndex], this.token));
      }
    }
    Promise.all(promises).then((rawTileData) => {
      if (tileCoordinates && rawTileData[0]) {
        const vectorArray = this.addTileCoordinates(tileCoordinates, this.groupData(rawTileData));
        this.drawTileFromVectorArray(canvas, vectorArray);
        this.storeAsPlaybackData(vectorArray, tileCoordinates);
      }
    });

    return canvas;
  }
}

export default CanvasLayer;
