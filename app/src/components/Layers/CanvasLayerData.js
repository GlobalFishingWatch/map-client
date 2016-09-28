import _ from 'lodash';
import PelagosClient from '../../lib/pelagosClient';
import { API_RETURNED_KEYS, PLAYBACK_PRECISION, VESSEL_RESOLUTION, VESSEL_GRID_SIZE } from '../../constants';

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

      const gridX = Math.floor(vectorArray.x[index] / VESSEL_RESOLUTION);
      const gridY = Math.floor(vectorArray.y[index] / VESSEL_RESOLUTION);
      // const gridOffset = gridY * VESSEL_GRID_SIZE + gridX;

      // if (!tilePlaybackDataGrid[timeIndex]) {
      //   tilePlaybackDataGrid[timeIndex] = [];
      // }
      // if (!tilePlaybackDataGrid[timeIndex][gridOffset]) {
      //   tilePlaybackDataGrid[timeIndex][gridOffset] = [];
      // }
      //
      // tilePlaybackDataGrid[timeIndex][gridOffset].push({
      //   weight: vectorArray.weight[index],
      //   sigma: vectorArray.sigma[index],
      //   category
      // });

      if (!tilePlaybackData[timeIndex]) {
        tilePlaybackData[timeIndex] = {
          category: [category],
          latitude: [vectorArray.latitude[index]],
          longitude: [vectorArray.longitude[index]],
          weight: [vectorArray.weight[index]],
          // x: [vectorArray.x[index]],
          // y: [vectorArray.y[index]],
          gridX: [gridX],
          gridY: [gridY],
          series: [vectorArray.series[index]],
          seriesgroup: [vectorArray.seriesgroup[index]],
          sigma: [vectorArray.sigma[index]]
        };
        continue;
      }
      const timestamp = tilePlaybackData[timeIndex];
      timestamp.category.push(category);
      timestamp.latitude.push(vectorArray.latitude[index]);
      timestamp.longitude.push(vectorArray.longitude[index]);
      timestamp.weight.push(vectorArray.weight[index]);
      // timestamp.x.push(vectorArray.x[index]);
      // timestamp.y.push(vectorArray.y[index]);
      timestamp.gridX.push(gridX);
      timestamp.gridY.push(gridY);
      timestamp.series.push(vectorArray.series[index]);
      timestamp.seriesgroup.push(vectorArray.seriesgroup[index]);
      timestamp.sigma.push(vectorArray.sigma[index]);
    }

    // console.log(tilePlaybackDataGrid)
    // return tilePlaybackDataGrid;
    // console.log(tilePlaybackData)
    return tilePlaybackData;
  },

  // stacks all timestamps into one grid array
  // aggregate weights values
  // compressTilePlaybackData(tilePlaybackDataGrid, startIndex, endIndex) {
  //   const tile = [];
  //   for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex ++) {
  //     if (!tilePlaybackDataGrid[timeIndex]) {
  //       continue;
  //     }
  //     for (let gridOffset = 0, length = tilePlaybackDataGrid[timeIndex].length; gridOffset < length; gridOffset++) {
  //       const grid = tilePlaybackDataGrid[timeIndex][gridOffset];
  //       if (!grid) {
  //         continue;
  //       }
  //       if (!tile[gridOffset]) {
  //         add stacked points at same time, same x, and same y
  //         tile[gridOffset] = grid.map(p => p.weight).reduce((pre, cur) => pre + cur);
  //         tile[gridOffset] = 2;
  //       }
  //       else {
  //         tile[gridOffset] += grid.map(p => p.weight).reduce((pre, cur) => pre + cur);
  //       }
  //     }
  //   }
  //   // console.log(tile);
  //   return tile;
  // }

  //
  compressTilePlaybackData(tilePlaybackData, startIndex, endIndex) {
    const gridOffsets = [];
    const xs = [];
    const ys = [];
    const values = [];
    let initialNum = 0;
    let finalNum = 0;
    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex ++) {
      const points = tilePlaybackData[timeIndex];
      if (!points) continue;
      for (let index = 0, len = points.gridX.length; index < len; index++) {
        initialNum++;
        const x = points.gridX[index];
        const y = points.gridY[index];
        const value = points.weight[index];
        const gridOffset = x * VESSEL_GRID_SIZE + y;
        const ptIndex = gridOffsets.indexOf(gridOffset);
        if (ptIndex > -1) {
          values[ptIndex] += value;
        } else {
          finalNum++;
          gridOffsets.push(gridOffset);
          xs.push(x);
          ys.push(y);
          values.push(value);
        }
      }
    }

    // console.log(initialNum, '->', finalNum);
    return {
      xs,
      ys,
      values
    }
  }


};
