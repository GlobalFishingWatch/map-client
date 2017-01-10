import PelagosClient from 'lib/pelagosClient';
import _ from 'lodash';
import * as d3 from 'd3';
import {
  PLAYBACK_PRECISION,
  VESSELS_ENDPOINT_KEYS,
  VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD,
  VESSELS_MINIMUM_RADIUS_FACTOR,
  VESSELS_MINIMUM_OPACITY,
  VESSEL_CLICK_TOLERANCE_PX
} from 'constants';

/**
 * From a timestamp in ms returns a time with the precision set in Constants.
 * @param timestamp
 */
export const getTimeAtPrecision = timestamp =>
  Math.floor(timestamp / PLAYBACK_PRECISION);

/**
 * From a timestamp in ms returns a time with the precision set in Constants, offseted at the
 * beginning of avaliable time (outerStart)
 * @param timestamp
 */
export const getOffsetedTimeAtPrecision = (timestamp, overallStartDateOffset) =>
  Math.max(0, getTimeAtPrecision(timestamp) - overallStartDateOffset);

/**
 * Generates the URLs to load vessel track data
 *
 * @param tilesetUrl
 * @param tileCoordinates
 * @param startDate
 * @param timelineOverallEndDate
 * @returns {Array}
 */
const getTemporalTileURLs = (tilesetUrl, tileCoordinates, timelineOverallStartDate, timelineOverallEndDate) => {
  const startYear = new Date(timelineOverallStartDate).getUTCFullYear();
  const endYear = new Date(timelineOverallEndDate).getUTCFullYear();
  const urls = [];
  for (let year = startYear; year <= endYear; year++) {
    urls.push(`${tilesetUrl}/\
${year}-01-01T00:00:00.000Z,${year + 1}-01-01T00:00:00.000Z;
${tileCoordinates.zoom},${tileCoordinates.x},${tileCoordinates.y}`);
  }
  return urls;
};

export const getTilePelagosPromises = (tilesetUrl, tileCoordinates, timelineOverallStartDate, timelineOverallEndDate, token) => {
  const promises = [];
  if (tileCoordinates) {
    const urls = getTemporalTileURLs(
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
};

export const getCleanVectorArrays = rawTileData => rawTileData.filter(vectorArray => vectorArray !== null);

/**
 * As data will come in multiple arrays (1 per API query/year basically), they need to be merged here
 *
 * @param vectorArrays an array of objects containing a Float32Array for each vessel param (lat, lon, weight...)
 * @param vectorArraysKeys the keys to pick on the vectorArrays (lat, lon, weight, etc)
 * @returns an object containing a Float32Array for each API_RETURNED_KEY (lat, lon, weight, etc)
 */
export const groupData = (cleanVectorArrays, vectorArraysKeys = VESSELS_ENDPOINT_KEYS) => {
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
};

/**
 * Add projected lat/long values transformed as tile-relative x/y coordinates
 */
export const addTilePixelCoordinates = (tileCoordinates, vectorArray) => {
  const data = vectorArray;
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
    let y = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 0)) * 256; // eslint-disable-line
    x *= scale;
    y *= scale;

    data.x[index] = ~~((x - tileBaseX) << zoomDiff);
    data.y[index] = ~~((y - tileBaseY) << zoomDiff);
  }
  return data;
};

/**
 * Converts Vector Array data to Playback format and stores it locally
 *
 * @param vectorArray
 * @param tileCoordinates
 */
export const getTilePlaybackData = (zoom, vectorArray, overallStartDate, overallEndDate, overallStartDateOffset) => {
  const tilePlaybackData = [];

  const zoomFactorRadius = Math.pow(zoom - 1, 2.5);
  const zoomFactorRadiusRenderingMode = (zoom < VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD) ? 0.3 : 0.2;
  const zoomFactorOpacity = Math.pow(zoom - 1, 3.5);

  for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
    const datetime = vectorArray.datetime[index];

    const timeIndex = getOffsetedTimeAtPrecision(datetime, overallStartDateOffset);
    const x = vectorArray.x[index];
    const y = vectorArray.y[index];
    const weight = vectorArray.weight[index];
    const sigma = vectorArray.sigma[index];
    let radius = zoomFactorRadiusRenderingMode * Math.max(0.8, 2 + Math.log(sigma * zoomFactorRadius));
    radius = Math.max(VESSELS_MINIMUM_RADIUS_FACTOR, radius);
    let opacity = 3 + Math.log(3 + Math.log((weight * zoomFactorOpacity) / 1000));
    opacity = 0.1 + 0.2 * opacity;
    opacity = Math.min(1, Math.max(VESSELS_MINIMUM_OPACITY, opacity));

    if (!tilePlaybackData[timeIndex]) {
      tilePlaybackData[timeIndex] = {
        x: [x],
        y: [y],
        weight: [weight],
        sigma: [sigma],
        radius: [radius],
        opacity: [opacity],
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
    timestamp.sigma.push(sigma);
    timestamp.radius.push(radius);
    timestamp.opacity.push(opacity);
    timestamp.category.push(vectorArray.category[index]);
    timestamp.series.push(vectorArray.series[index]);
    timestamp.seriesgroup.push(vectorArray.seriesgroup[index]);
  }

  return tilePlaybackData;
};

export const selectVesselsAt = (tileData, localX, localY, startIndex, endIndex) => {
  const vessels = [];

  for (let f = startIndex; f < endIndex; f++) {
    const frame = tileData[f];
    if (frame === undefined) continue;
    for (let i = 0; i < frame.x.length; i++) {
      const vx = frame.x[i];
      const vy = frame.y[i];
      if (vx >= localX - VESSEL_CLICK_TOLERANCE_PX && vx <= localX + VESSEL_CLICK_TOLERANCE_PX &&
          vy >= localY - VESSEL_CLICK_TOLERANCE_PX && vy <= localY + VESSEL_CLICK_TOLERANCE_PX) {
        vessels.push({
          category: frame.category[i],
          series: frame.series[i],
          seriesgroup: frame.seriesgroup[i]
        });
      }
    }
  }
  return vessels;
};

export const getHistogram = (tiles, propName = 'weight') => {
  let data = tiles
    .filter(tile => tile.ready)
    .map(tile => tile.data
      .map(frame => frame[propName]));
  data = _.flattenDeep(data);
  if (data.length) {
    const bins = d3.histogram().thresholds(d3.thresholdScott)(data);
    const x = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).range([0, 50]);
    /* eslint no-console:0 */
    console.table(bins.filter(bin => bin.length).map(bin => {
      const binMin = d3.min(bin).toLocaleString({ maximumFractionDigits: 2 });
      const binMax = d3.max(bin).toLocaleString({ maximumFractionDigits: 2 });
      return {
        range: [binMin, binMax].join('﹣'),
        bars: Array(Math.round(x(bin.length))).join('█'),
        num: bin.length
      };
    }));
  }
};
