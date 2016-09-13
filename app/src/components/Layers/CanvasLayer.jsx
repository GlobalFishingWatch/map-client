/* eslint no-underscore-dangle:0 */
import PelagosClient from '../../lib/pelagosClient';
import { TIMELINE_STEP, API_RETURNED_KEYS } from '../../constants';
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
    this.setVesselTransparency(vesselTransparency);
    this.setVesselColor(vesselColor);

    this.outerStartDate = filters.startDate;
    this.outerStartDateDayOffset = Math.floor(this.outerStartDate / 86400000);
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
    this._computeVesselColor();
  }

  setVesselTransparency(vesselTransparency) {
    this.vesselTransparency = vesselTransparency;
    this._computeVesselColor();
  }

  _computeVesselColor() {
    if (!this.vesselColor || !this.vesselTransparency) return;
    // for now does not allows for varying levels of opacity
    // by doing this we can batch drawing commands (fill called only once) - see drawVesselPoint
    // and we don't have to do string interpolation for each point
    // TODO check if varying levels of opacity are really needed.
    // If so, sort values into 3-4 distinguishable opacity values into arrays
    const finalOpacity = (100 - this.vesselTransparency) / 100;
    this.precomputedVesselColor = `rgba(${this.vesselColor.r}\
,${this.vesselColor.g},${this.vesselColor.b},${finalOpacity})`;
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
  drawTimeRange(startDayIndex, endDayIndex) {
    const canvasKeys = Object.keys(this.playbackData);

    for (let index = 0, length = canvasKeys.length; index < length; index++) {
      const canvasKey = canvasKeys[index];
      const canvas = document.getElementById(canvasKeys[index]);
      if (!canvas) {
        return;
      }
      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let timestamp = startDayIndex; timestamp < endDayIndex; timestamp ++) {
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
  drawTileFromPlaybackData(canvas, playbackData) {
    if (!canvas) {
      return;
    }
    // const size = canvas.zoom > 6 ? 3 : 2;

    this.drawVesselPoints(canvas.ctx, playbackData);
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
    // const size = canvas.zoom > 6 ? 3 : 2;
    this.drawVesselPoints(canvas.ctx, vectorArray, true);
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

    for (let index = 0, length = data.latitude.length; index < length; index++) {
      const lat = data.latitude[index];
      const lng = data.longitude[index];
      let x = (lng + 180) / 360 * 256;
      let y = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 0)) * 256;
      x *= scale;
      y *= scale;

      data.x[index] = ~~((x - tileBaseX) << zoomDiff);
      data.y[index] = ~~((y - tileBaseY) << zoomDiff);
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

      const dayIndex = Math.floor(vectorArray.datetime[index] / 86400000) - this.outerStartDateDayOffset;


      if (!this.playbackData[tileId][dayIndex]) {
        this.playbackData[tileId][dayIndex] = {
          category: [vectorArray.category[index]],
          latitude: [vectorArray.latitude[index]],
          longitude: [vectorArray.longitude[index]],
          weight: [vectorArray.weight[index]],
          x: [vectorArray.x[index]],
          y: [vectorArray.y[index]],
          series: [vectorArray.series[index]],
          seriesgroup: [vectorArray.seriesgroup[index]],
          sigma: [vectorArray.sigma[index]]
        };
        continue;
      }
      const timestamp = this.playbackData[tileId][dayIndex];
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

  drawVesselPoints(ctx, points, testFilters) {
    ctx.fillStyle = this.precomputedVesselColor;
    ctx.beginPath();
    for (let index = 0, len = points.latitude.length; index < len; index++) {
      if (testFilters && !this.passesFilters(points, index, true)) {
        continue;
      }
      this.drawVesselPoint(
        ctx,
        points.x[index],
        points.y[index],
        points.weight[index] /* ,
        vectorArray.sigma[index] */
      );
    }
    ctx.fill();
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
  drawVesselPoint(ctx, x, y, weight /*, sigma */) {
    const radius = Math.max(1, weight / 50);
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
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
   * As data will come in multiple arrays (1 per year basically), they need to be merged here
   *
   * @param vectorArrays an array of objects containing a Float32Array for each API_RETURNED_KEY (lat, lon, weight, etc)
   * @returns {*}
   */
  groupData(vectorArrays) {
    if (!vectorArrays || vectorArrays.length === 0) return null;
    const data = {};

    const cleanVectorArrays = vectorArrays.filter(vectorArray => vectorArray !== null);
    const totalVectorArraysLength = _.sumBy(cleanVectorArrays, a => a.longitude.length);

    API_RETURNED_KEYS.forEach((key) => {
      data[key] = new Float32Array(totalVectorArraysLength);
    });

    for (let index = 0, length = cleanVectorArrays.length; index < length; index++) {
      const currentArray = cleanVectorArrays[index];
      const offset = (index === 0) ? 0 : cleanVectorArrays[index - 1].longitude.length;
      API_RETURNED_KEYS.forEach((key) => {
        data[key].set(currentArray[key], offset);
      });
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
