import _ from 'lodash';
import PelagosClient from 'lib/pelagosClient';
import { VESSELS_ENDPOINT_KEYS, PLAYBACK_PRECISION } from 'constants';

export default {
  getTilePelagosPromises(tilesetUrl, tileCoordinates, timelineOverallStartDate, timelineOverallEndDate, token) {
    const promises = [];
    if (tileCoordinates) {
      const urls = this.getTemporalTileURLs(
        tilesetUrl,
        tileCoordinates,
        timelineOverallStartDate,
        timelineOverallEndDate
      );
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
   * @param tilesetUrl
   * @param tileCoordinates
   * @param startDate
   * @param timelineOverallEndDate
   * @returns {Array}
   */
  getTemporalTileURLs(tilesetUrl, tileCoordinates, timelineOverallStartDate, timelineOverallEndDate) {
    const startYear = new Date(timelineOverallStartDate).getUTCFullYear();
    const endYear = new Date(timelineOverallEndDate).getUTCFullYear();
    const urls = [];
    for (let year = startYear; year <= endYear; year++) {
      urls.push(`${tilesetUrl}/\
${year}-01-01T00:00:00.000Z,${year + 1}-01-01T00:00:00.000Z;
${tileCoordinates.zoom},${tileCoordinates.x},${tileCoordinates.y}`);
    }
    return urls;
  },

  getCleanVectorArrays(rawTileData) {
    return rawTileData.filter(vectorArray => vectorArray !== null);
  },

  /**
   * As data will come in multiple arrays (1 per API query/year basically), they need to be merged here
   *
   * @param vectorArrays an array of objects containing a Float32Array for each vessel param (lat, lon, weight...)
   * @param vectorArraysKeys the keys to pick on the vectorArrays (lat, lon, weight, etc)
   * @returns an object containing a Float32Array for each API_RETURNED_KEY (lat, lon, weight, etc)
   */
  groupData(cleanVectorArrays, vectorArraysKeys = VESSELS_ENDPOINT_KEYS) {
    const data = {};

    const totalVectorArraysLength = _.sumBy(cleanVectorArrays, a => a.longitude.length);

    vectorArraysKeys.forEach((key) => {
      data[key] = new Float32Array(totalVectorArraysLength);
    });

    let currentArray;
    let cumulatedOffsets = 0;

    const appendValues = key => {
      data[key].set(currentArray[key], cumulatedOffsets);
    };

    for (let index = 0, length = cleanVectorArrays.length; index < length; index++) {
      currentArray = cleanVectorArrays[index];
      vectorArraysKeys.forEach(appendValues);
      cumulatedOffsets += currentArray.longitude.length;
    }
    return data;
  },

  /**
   * From a timestamp in ms returns a time with the precision set in Constants, offseted at the
   * beginning of avaliable time (outerStart)
   * @param timestamp
   */
  getOffsetedTimeAtPrecision(timestamp, overallStartDateOffset) {
    return Math.max(0, this.getTimeAtPrecision(timestamp) - overallStartDateOffset);
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
  getTilePlaybackData(vectorArray, overallStartDate, overallEndDate, overallStartDateOffset) {
    const tilePlaybackData = [];
    // const tilePlaybackDataGrid = [];

    let max = 0;
    let min = Infinity;



    for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
      const datetime = vectorArray.datetime[index];

      if (datetime < overallStartDate || datetime > overallEndDate) {
        continue;
      }
      // keep?
      // if (!data.weight[index]) {
      //   return false;
      // }
      const timeIndex = this.getOffsetedTimeAtPrecision(datetime, overallStartDateOffset);
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
          weight: [weight],
          value: [value],
          category: [vectorArray.category[index]],
          series: [vectorArray.series[index]],
          seriesgroup: [vectorArray.seriesgroup[index]]
        };
        continue;
      }
      const timestamp = tilePlaybackData[timeIndex];
      timestamp.x.push(x);
      timestamp.y.push(y);
      timestamp.weight.push(weight);
      timestamp.value.push(value);
      timestamp.category.push(vectorArray.category[index]);
      timestamp.series.push(vectorArray.series[index]);
      timestamp.seriesgroup.push(vectorArray.seriesgroup[index]);
    }

    return tilePlaybackData;
  }
};
