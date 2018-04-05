import PelagosClient from 'lib/pelagosClient';
import pull from 'lodash/pull';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import buildEndpoint from 'utils/buildEndpoint';
import convert from 'globalfishingwatch-convert';
import { lngLatToWorld } from 'viewport-mercator-project';

import { VESSEL_CLICK_TOLERANCE_PX } from 'config';

import getPBFTile from './getPBFTile';

/**
 * Generates the URLs to load vessel track data for a tile
 *
 * @param {string} tilesetUrl       the tileset base URL
 * @param {array} temporalExtents   all tileset temporal extents
 * @param {object} params           - seriesgroup: a seriesgroup id, used for tracks loading
 *                                  - tileCoordinates: this tiles tile coordinates (zoom, x, y). Will default to 0,0,0
 *                                  - temporalExtentsIndices: restrict to these temporalExtents indices
 * @returns {Array}                 an array of URLs for this tile
 */
const getTemporalTileURLs = (urlTemplate, temporalExtents, params) => {
  const urls = [];

  (temporalExtents || [null]).forEach((extent, index) => {
    const urlParams = {
      id: params.seriesgroup
    };
    if (extent !== null && params.temporalExtentsLess !== true) {
      urlParams.startTimeISO = new Date(extent[0]).toISOString();
      urlParams.endTimeISO = new Date(extent[1]).toISOString();
    }
    if (params.tileCoordinates) {
      urlParams.x = params.tileCoordinates.x;
      urlParams.y = params.tileCoordinates.y;
      urlParams.z = params.tileCoordinates.zoom;
    }

    const url = buildEndpoint(urlTemplate, urlParams);

    if (params.temporalExtentsLess === true || !params.temporalExtentsIndices || params.temporalExtentsIndices.indexOf(index) > -1) {
      urls.push(url);
    }
  });
  return urls;
};


/**
 * See getTemporalTileURLs.
 */
export const getTilePromises = (tilesetUrl, token, temporalExtents, params) => {
  const promises = [];
  const urls = getTemporalTileURLs(
    tilesetUrl,
    temporalExtents,
    params
  );
  for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
    if (params.isPBF === true) {
      promises.push(getPBFTile(urls[urlIndex]));
    } else {
      promises.push(new PelagosClient().obtainTile(urls[urlIndex], token));
    }
  }

  return promises;
};


export const getCleanVectorArrays = rawTileData => rawTileData.filter(vectorArray => vectorArray !== null);

/**
 * As data will come in multiple arrays (1 per API query/year basically), they need to be merged here
 *
 * @param cleanVectorArrays an array of objects containing a Float32Array for each vessel param (lat, lon, weight...)
 * @param columns the keys to pick on the vectorArrays (lat, lon, weight, etc)
 * @returns an object containing a Float32Array for each API_RETURNED_KEY (lat, lon, weight, etc)
 */
export const groupData = (cleanVectorArrays, columns) => {
  const data = {};

  const totalVectorArraysLength = sumBy(cleanVectorArrays, a => a.longitude.length);

  const filteredColumns = columns.filter((column) => {
    if (cleanVectorArrays[0] && cleanVectorArrays[0][column] === undefined) {
      console.warn(`column ${column} is present in layerHeader.colsByName but not in tile data`);
      return false;
    }
    return true;
  });

  filteredColumns.forEach((key) => {
    data[key] = new Float32Array(totalVectorArraysLength);
  });

  let currentArray;
  let cumulatedOffsets = 0;

  const appendValues = (key) => {
    data[key].set(currentArray[key], cumulatedOffsets);
  };

  for (let index = 0, length = cleanVectorArrays.length; index < length; index++) {
    currentArray = cleanVectorArrays[index];
    filteredColumns.forEach(appendValues);
    cumulatedOffsets += currentArray.longitude.length;
  }
  return data;
};

/**
 * Converts Vector Array data to Playback format and stores it locally.
 * The data structure is an array indexed by a time unit, ie a set of points every day
 * This preprocessing step allows playback to play smoothly as the necessary conversions and data structure set up
 * is done once (after tile has been loaded)
 *
 * @param data the source data before indexing by day, an object containing
 *  - a vector (Float32Array) for each header's column in the case of Pelagos tiles
 *  - an array of points int the case of PBF tiles
 * @param colsByName the columns present on the dataset, determined by tileset headers
 * @param tileCoordinates x, y, z
 * @param isPBF bool whether data is a PBF vector tile (true) or a Pelagos tile (false)
 * @param prevPlaybackData an optional previously loaded tilePlaybackData array (when adding time range)
 */
export const getTilePlaybackData = (data, colsByName, tileCoordinates, isPBF, prevPlaybackData) => {
  const tilePlaybackData = (prevPlaybackData === undefined) ? [] : prevPlaybackData;

  const zoom = tileCoordinates.zoom;
  const zoomFactorRadius = convert.getZoomFactorRadius(zoom);
  const zoomFactorRadiusRenderingMode = convert.getZoomFactorRadiusRenderingMode(zoom);
  const zoomFactorOpacity = convert.getZoomFactorOpacity(zoom);

  // store all available columns as object keys
  const columns = {};
  const columnsArr = Object.keys(colsByName);
  columnsArr.forEach((c) => { columns[c] = true; });

  // columns specified by layer header columns
  let storedColumns = [].concat(columnsArr);
  if (columns.sigma === true) storedColumns.push('radius');
  if (columns.weight === true) storedColumns.push('opacity');
  if (columns.longitude === true) {
    storedColumns.push('worldX');
    storedColumns.push('worldY');
  }
  if (columns.id === true) {
    storedColumns.push('series');
  }

  // omit values that will be transformed before being stored to playback data (ie lat -> worldY)
  // only if hidden: true flag is set on header
  ['latitude', 'longitude', 'datetime'].forEach((col) => {
    if (colsByName[col] === undefined || colsByName[col].hidden === true) {
      pull(storedColumns, col);
    }
  });
  // always pull sigma and weight
  pull(storedColumns, 'sigma', 'weight');
  storedColumns = uniq(storedColumns);

  const numPoints = (isPBF === true) ? data.length : data.latitude.length;

  for (let index = 0, length = numPoints; index < length; index++) {
    let point;
    if (isPBF === true) {
      const feature = data.feature(index);
      point = feature.properties;
      // WARNING: toGeoJSON is expensive. Avoid using raw coordinates in PBF tiles, pregenerate world coords
      if (!columns.worldX) {
        const geom = feature.toGeoJSON(tileCoordinates.x, tileCoordinates.y, zoom).geometry.coordinates;
        point.longitude = geom[0];
        point.latitude = geom[1];
      }
    } else {
      point = {};
      columnsArr.forEach((c) => { point[c] = data[c][index]; });
    }

    const timeIndex = (columns.timeIndex)
      ? point.timeIndex : convert.getOffsetedTimeAtPrecision(point.datetime);

    if (!columns.worldX) {
      const [worldX, worldY] = lngLatToWorld([point.longitude, point.latitude], 1);
      point.worldX = worldX;
      point.worldY = worldY;
    }
    if (columns.sigma) {
      point.radius = convert.sigmaToRadius(point.sigma, zoomFactorRadiusRenderingMode, zoomFactorRadius);
    }
    if (columns.weight) {
      point.opacity = convert.weightToOpacity(point.weight, zoomFactorOpacity);
    }
    if (columns.id) {
      point.series = point.id;
    }

    if (!tilePlaybackData[timeIndex]) {
      const frame = {};
      storedColumns.forEach((column) => {
        frame[column] = [point[column]];
      });
      tilePlaybackData[timeIndex] = frame;
      continue;
    }
    const frame = tilePlaybackData[timeIndex];
    storedColumns.forEach((column) => {
      frame[column].push(point[column]);
    });
  }
  return tilePlaybackData;
};


export const addTracksPointsRenderingData = (data) => {
  data.hasFishing = [];
  data.worldX = [];
  data.worldY = [];

  for (let index = 0, length = data.weight.length; index < length; index++) {
    const [worldX, worldY] = lngLatToWorld([data.longitude[index], data.latitude[index]], 1);
    data.worldX[index] = worldX;
    data.worldY[index] = worldY;
    data.hasFishing[index] = data.weight[index] > 0;
  }
  return data;
};


/**
 * A simplified version of getTilePlaybackData for tracks
 * Converts Vector Array data to Playback format (organized by days) and stores it locally
 * @param vectorArray the source data before indexing by day
 */
export const getTracksPlaybackData = (vectorArray) => {
  const playbackData = [];

  for (let index = 0, length = vectorArray.series.length; index < length; index++) {
    const datetime = vectorArray.datetime[index];
    const timeIndex = convert.getOffsetedTimeAtPrecision(datetime);

    if (!playbackData[timeIndex]) {
      const frame = {
        worldX: [vectorArray.worldX[index]],
        worldY: [vectorArray.worldY[index]],
        series: [vectorArray.series[index]],
        hasFishing: [vectorArray.hasFishing[index]]
      };
      playbackData[timeIndex] = frame;
      continue;
    }
    const frame = playbackData[timeIndex];
    frame.worldX.push(vectorArray.worldX[index]);
    frame.worldY.push(vectorArray.worldY[index]);
    frame.series.push(vectorArray.series[index]);
    frame.hasFishing.push(vectorArray.hasFishing[index]);
  }
  return playbackData;
};

export const vesselSatisfiesFilters = (frame, index, filterValues) => {
  const satisfiesFilters = Object.keys(filterValues).every((field) => {
    if (frame[field] === undefined) {
      // this field is not available on this layer. This can happen in an edge case described
      // here: https://github.com/Vizzuality/GlobalFishingWatch/issues/661#issuecomment-334496469
      return false;
    }
    return filterValues[field].indexOf(frame[field][index]) > -1;
  });
  return satisfiesFilters;
};

const vesselSatisfiesAllFilters = (frame, index, filters) => {
  const satisfiesAllFilters = filters
    .filter(f => f.pass !== true)
    .some(filter => vesselSatisfiesFilters(frame, index, filter.filterValues));
  return satisfiesAllFilters;
};

export const selectVesselsAt = (tileData, tileQuery, startIndex, endIndex, currentFilters) => {
  const vessels = [];

  const { worldX, worldY, toleranceRadiusInWorldUnits } = tileQuery;

  for (let f = startIndex; f < endIndex; f++) {
    const frame = tileData[f];
    if (frame === undefined) continue;
    for (let i = 0; i < frame.worldX.length; i++) {
      const wx = frame.worldX[i];
      const wy = frame.worldY[i];

      if ((!currentFilters.length || vesselSatisfiesAllFilters(frame, i, currentFilters)) &&
          wx >= worldX - toleranceRadiusInWorldUnits && wx <= worldX + toleranceRadiusInWorldUnits &&
          wy >= worldY - toleranceRadiusInWorldUnits && wy <= worldY + toleranceRadiusInWorldUnits) {
        const vessel = {};

        Object.keys(frame).forEach((key) => {
          vessel[key] = frame[key][i];
        });
        vessels.push(vessel);
      }
    }
  }
  return vessels;
};

/*
export const getHistogram = (tiles, propName = 'weight') => {
  let data = tiles
    .filter(tile => tile.ready)
    .map(tile => tile.data
      .map(frame => frame[propName]));
  data = flattenDeep(data);
  if (data.length) {
    const bins = d3.histogram().thresholds(d3.thresholdScott)(data);
    const x = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).range([0, 50]);
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
*/
