import _ from 'lodash';
import PelagosClient from '../../lib/pelagosClient';
import { API_RETURNED_KEYS, PLAYBACK_PRECISION } from '../../constants';

export default {
  getTilePelagosPromises(tileCoordinates, outerStartDate, outerEndDate, token) {
    const promises = [];

    if (tileCoordinates) {
      const urls = this.getTemporalTileURLs(tileCoordinates, outerStartDate, outerEndDate);
      for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
        promises.push(new PelagosClient().obtainTile(urls[urlIndex], token));
      }
    }

    return promises;
  },

  /**
   * Generates tile coordinates in x/y/zoom
   *
   * @param coord
   * @param zoom
   * @returns {*}
   */
  getTileCoordinates(coord, zoom) {
    const tileRange = 1 << zoom;

    const y = coord.y;

    // too close to the poles, GTFO
    if (y < 0 || y >= tileRange) {
      return null;
    }

    // modulo: cycle through values of tileRange so x is never outside of [-tileRange, tileRange]
    let x = coord.x % tileRange;

    // cycle through values of tileRange when crossing the antimeridian from east to west
    if (x < 0) {
      x += tileRange;
    }

    return { x, y, zoom };
  },

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
  },

  getCleanVectorArrays(rawTileData) {
    return rawTileData.filter(vectorArray => vectorArray !== null);
  },

  /**
   * As data will come in multiple arrays (1 per year basically), they need to be merged here
   *
   * @param vectorArrays an array of objects containing a Float32Array for each API_RETURNED_KEY (lat, lon, weight, etc)
   * @returns {*}
   */
  groupData(cleanVectorArrays) {
    const data = {};

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
  },

  /**
   * From a timestamp in ms returns a time with the precision set in Constants, offseted at the
   * beginning of avaliable time (outerStart)
   * @param timestamp
   */
  getOffsetedTimeAtPrecision(timestamp, outerStartDateOffset) {
    return Math.max(0, this.getTimeAtPrecision(timestamp) - outerStartDateOffset);
  },

  /**
   * From a timestamp in ms returns a time with the precision set in Constants.
   * @param timestamp
   */
  getTimeAtPrecision(timestamp) {
    return Math.floor(timestamp / PLAYBACK_PRECISION);
  },

  /**
   * Converts Vector Array data to Playback format and stores it locally
   *
   * @param vectorArray
   * @param tileCoordinates
   */
  getTilePlaybackData(vectorArray, outerStartDate, outerEndDate, outerStartDateOffset, flag) {
    const tilePlaybackData = [];
    // const tilePlaybackDataGrid = [];

    let max = 0;
    let min = Infinity;

    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      const datetime = vectorArray.datetime[index];

      if (datetime < outerStartDate || datetime > outerEndDate) {
        continue;
      }
      // keep?
      // if (!data.weight[index]) {
      //   return false;
      // }
      const category = vectorArray.category[index];
      if (flag && flag !== category) {
        continue;
      }

      const timeIndex = this.getOffsetedTimeAtPrecision(datetime, outerStartDateOffset);
      const x = vectorArray.x[index];
      const y = vectorArray.y[index];
      const weight = vectorArray.weight[index];
      const value = Math.sqrt(weight) * 0.2;

      if (value > max) max = value;
      if (value < min) min = value;

      // const value = Math.max(0.1, Math.min(1, weight / 2));

      if (!tilePlaybackData[timeIndex]) {
        tilePlaybackData[timeIndex] = {
          x: [x],
          y: [y],
          value: [value]
        };
        continue;
      }
      const timestamp = tilePlaybackData[timeIndex];
      timestamp.x.push(x);
      timestamp.y.push(y);
      timestamp.value.push(value);
    }



    // console.log(min, max)
    // console.log(tilePlaybackDataGrid)
    // return tilePlaybackDataGrid;
    // console.log(tilePlaybackData)
    return tilePlaybackData;
  }
};
