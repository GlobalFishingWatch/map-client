import PelagosClient from 'lib/pelagosClient';
import _ from 'lodash';
import * as d3 from 'd3';
import {
  PLAYBACK_PRECISION,
  VESSELS_ENDPOINT_KEYS,
  VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD,
  VESSELS_MINIMUM_RADIUS_FACTOR,
  VESSELS_MINIMUM_OPACITY,
  VESSEL_CLICK_TOLERANCE_PX,
  TIMELINE_OVERALL_START_DATE_OFFSET
} from 'constants';

/**
 * From a timestamp in ms returns a time with the precision set in Constants.
 * @param timestamp
 */
export const getTimeAtPrecision = timestamp =>
  Math.floor(timestamp / PLAYBACK_PRECISION);

/**
 * From a timestamp in ms returns a time with the precision set in Constants, offseted at the
 * beginning of available time (outerStart)
 * @param timestamp
 */
export const getOffsetedTimeAtPrecision = timestamp =>
  Math.max(0, getTimeAtPrecision(timestamp) - TIMELINE_OVERALL_START_DATE_OFFSET);

/**
 * Generates the URLs to load vessel track data
 *
 * @param tilesetUrl
 * @param tileCoordinates
 * @param startDate
 * @param timelineOverallEndDate
 * @returns {Array}
 */
const getTemporalTileURLs = (tilesetUrl, temporalExtents, params) => {
  const urls = [];
  temporalExtents.forEach((extent) => {
    const start = new Date(extent[0]).toISOString();
    const end = new Date(extent[1]).toISOString();
    let url = `${tilesetUrl}/`;
    if (params.seriesgroup) {
      url += `sub/seriesgroup=${params.seriesgroup}/`;
    }
    url += `${start},${end}`;
    if (params.tileCoordinates) {
      url += `;${params.tileCoordinates.zoom},${params.tileCoordinates.x},${params.tileCoordinates.y}`;
    } else {
      // meh.
      url += ';0,0,0';
    }
    urls.push(url);
  });
  return urls;
};

export const getTilePelagosPromises = (tilesetUrl, token, temporalExtents, params) => {
  const promises = [];
  const urls = getTemporalTileURLs(
    tilesetUrl,
    temporalExtents,
    params
  );
  for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
    promises.push(new PelagosClient().obtainTile(urls[urlIndex], token));
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

  const appendValues = (key) => {
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
 * @param vectorArray typed arrays, including latitude and longitude
 * @param map a reference to the original Google Map
 * @param tileBounds the initial position of the tile in the DOM, used to offset screen coordinates to local tile coordinates
 */
export const addTilePixelCoordinates = (vectorArray, map, tileBounds) => {
  const data = vectorArray;
  const proj = map.getProjection();
  const top = proj.fromLatLngToPoint(map.getBounds().getNorthEast()).y;
  const left = proj.fromLatLngToPoint(map.getBounds().getSouthWest()).x;
  const tileTop = tileBounds.top;
  const tileLeft = tileBounds.left;
  const scale = 2 ** map.getZoom();
  data.x = new Int32Array(data.latitude.length);
  data.y = new Int32Array(data.latitude.length);

  for (let index = 0, length = data.latitude.length; index < length; index++) {
    const worldPoint = proj.fromLatLngToPoint(new google.maps.LatLng(data.latitude[index], data.longitude[index]));
    let worldX = worldPoint.x - left;
    // x < 0 : case where map left is behind dateline while point is beyond dateline
    if (worldX < 0 && tileLeft > 0) {
      worldX = worldPoint.x + (256 - left);
    }
    data.x[index] = (worldX * scale) - tileLeft;
    data.y[index] = ((worldPoint.y - top) * scale) - tileTop;
  }

  return data;
};

export const addTracksWorldCoordinates = (vectorArray, map) => {
  const data = vectorArray;
  const proj = map.getProjection();
  data.worldX = new Float32Array(data.latitude.length);
  data.worldY = new Float32Array(data.longitude.length);
  for (let index = 0, length = data.latitude.length; index < length; index++) {
    const worldPoint = proj.fromLatLngToPoint(new google.maps.LatLng(data.latitude[index], data.longitude[index]));
    data.worldX[index] = worldPoint.x;
    data.worldY[index] = worldPoint.y;
  }
  return data;
};

const _getZoomFactorRadiusRenderingMode = zoom => ((zoom < VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD) ? 0.3 : 0.15);
const _getZoomFactorRadius = zoom => (zoom - 1) ** 2.5;
const _getRadius = (sigma, zoomFactorRadiusRenderingMode, zoomFactorRadius) => {
  let radius = zoomFactorRadiusRenderingMode * Math.max(0.8, 2 + Math.log(sigma * zoomFactorRadius));
  radius = Math.max(VESSELS_MINIMUM_RADIUS_FACTOR, radius);
  return radius;
};

/**
 * Converts Vector Array data to Playback format and stores it locally
 *
 * @param vectorArray
 * @param tileCoordinates
 */
export const getTilePlaybackData = (zoom, vectorArray) => {
  const tilePlaybackData = [];

  const zoomFactorRadius = _getZoomFactorRadius(zoom);
  const zoomFactorRadiusRenderingMode = _getZoomFactorRadiusRenderingMode(zoom);

  const zoomFactorOpacity = (zoom - 1) ** 3.5;

  for (let index = 0, length = vectorArray.latitude.length; index < length; index++) {
    const datetime = vectorArray.datetime[index];

    const timeIndex = getOffsetedTimeAtPrecision(datetime);
    const x = vectorArray.x[index];
    const y = vectorArray.y[index];
    const weight = vectorArray.weight[index];
    const sigma = vectorArray.sigma[index];
    const radius = _getRadius(sigma, zoomFactorRadiusRenderingMode, zoomFactorRadius);
    let opacity = 3 + Math.log((weight * zoomFactorOpacity) / 1000);
    // TODO quick hack to avoid negative values, check why that happens
    opacity = Math.max(0, opacity);
    opacity = 3 + Math.log(opacity);
    opacity = 0.1 + (0.2 * opacity);
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

export const addTracksPointRadius = (data, zoom) => {
  const zoomFactorRadius = _getZoomFactorRadius(zoom);
  const zoomFactorRadiusRenderingMode = _getZoomFactorRadiusRenderingMode(zoom);

  data.radius = new Float32Array(data.latitude.length);

  for (let index = 0, length = data.latitude.length; index < length; index++) {
    data.radius[index] = _getRadius(data.sigma[index], zoomFactorRadiusRenderingMode, zoomFactorRadius);
  }
  return data;
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
    console.table(bins.filter(bin => bin.length).map((bin) => {
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
