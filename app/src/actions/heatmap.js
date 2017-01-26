import _ from 'lodash';
import { UPDATE_HEATMAP_TILES, COMPLETE_TILE_LOAD, SET_VESSEL_CLUSTER_CENTER } from 'actions';
import {
  getTimeAtPrecision,
  getTilePelagosPromises,
  getCleanVectorArrays,
  groupData,
  addTilePixelCoordinates,
  getTilePlaybackData,
  selectVesselsAt
} from 'actions/helpers/heatmapTileData';
import { clearVesselInfo, showNoVesselsInfo, addVessel, showVesselClusterInfo } from 'actions/vesselInfo';


function loadLayerTile(referenceTile, layerUrl, startDate, endDate, startDateOffset, token, map) {
  const canvas = referenceTile.canvas;
  const tileCoordinates = referenceTile.tileCoordinates;
  const pelagosPromises = getTilePelagosPromises(layerUrl, tileCoordinates, startDate, endDate, token);
  const allLayerPromises = Promise.all(pelagosPromises);
  const tile = {
    uid: referenceTile.uid,
    canvas
  };

  const layerTilePromise = new Promise((resolve) => {
    allLayerPromises.then((rawTileData) => {
      const cleanVectorArrays = getCleanVectorArrays(rawTileData);
      const groupedData = groupData(cleanVectorArrays);
      const bounds = referenceTile.canvas.getBoundingClientRect();
      const vectorArray = addTilePixelCoordinates(groupedData, map, bounds);
      const data = getTilePlaybackData(
        tileCoordinates.zoom,
        vectorArray,
        startDate,
        endDate,
        startDateOffset
      );
      tile.data = data;
      resolve(tile);
    });
  });

  return layerTilePromise;
}

export function getTile(uid, tileCoordinates, canvas) {
  return (dispatch, getState) => {
    const layers = getState().heatmap.heatmapLayers;
    const timelineOverallStartDate = getState().filters.timelineOverallExtent[0];
    const timelineOverallEndDate = getState().filters.timelineOverallExtent[1];
    const overallStartDateOffset = getTimeAtPrecision(timelineOverallStartDate);
    const token = getState().user.token;
    const map = getState().map.googleMaps;
    const allPromises = [];

    const referenceTile = {
      uid,
      tileCoordinates,
      canvas
    };

    // push ref tile

    Object.keys(layers).forEach((layerId) => {
      const tilePromise = loadLayerTile(
        referenceTile,
        layers[layerId].url,
        timelineOverallStartDate,
        timelineOverallEndDate,
        overallStartDateOffset,
        token,
        map
      );
      allPromises.push(tilePromise);
      tilePromise.then((tile) => {
        layers[layerId].tiles.push(tile);
        dispatch({
          type: UPDATE_HEATMAP_TILES, payload: layers
        });
      });
    });

    Promise.all(allPromises).then(() => {
      dispatch({
        type: COMPLETE_TILE_LOAD
      });
    });
  };
}

export function releaseTile(uid) {
  return (dispatch, getState) => {
    const layers = getState().heatmap.heatmapLayers;
    Object.keys(layers).forEach((layerId) => {
      const layer = layers[layerId];
      const tiles = layer.tiles;
      const releasedTileIndex = tiles.findIndex(tile => tile.uid === uid);
      if (releasedTileIndex === -1) {
        return;
      }
      tiles.splice(releasedTileIndex, 1);
    });
    dispatch({
      type: UPDATE_HEATMAP_TILES, payload: layers
    });
  };
}

export function queryHeatmap(tileQuery, latLng) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.user.userPermissions.indexOf('selectVessel') === -1) {
      return;
    }

    // TODO do not query all sublayers?
    const layers = state.heatmap.heatmapLayers;
    const timelineExtent = state.filters.timelineInnerExtentIndexes;
    const startIndex = timelineExtent[0];
    const endIndex = timelineExtent[1];
    let vessels = [];
    Object.keys(layers).forEach((layerId, index) => {
      const layer = layers[layerId];
      const queriedTile = layer.tiles.find(tile => tile.uid === tileQuery.uid);
      // TODO remove ?
      if (index === 0) {
        vessels.push(selectVesselsAt(queriedTile.data, tileQuery.localX, tileQuery.localY, startIndex, endIndex));
      }
    });
    vessels = _.flatten(vessels);

    // we can get multiple points with similar series and seriesgroup, in which case
    // we should treat that as a successful vessel query, not a cluster
    const allSeriesGroups = _.uniq(vessels.map(v => v.seriesgroup));
    const allSeries = _.uniq(vessels.map(v => v.series));

    dispatch(clearVesselInfo());
    if (vessels.length === 0) {
      // no results in this area
      // console.log('no results');
      dispatch(showNoVesselsInfo());
    } else if (allSeriesGroups.length === 1 && allSeries.length === 1 && allSeriesGroups[0] > 0) {
      // one seriesGroup, one series, and seriesGroup is > 0
      // (less than 0 means that points have been clustered server side):
      // only one valid result
      // console.log('one valid result');
      dispatch(addVessel(allSeriesGroups[0], allSeries[0]));
    } else {
      // multiple results
      // console.log('multiple results');
      // the following solely sets the cluster center in the state to be
      // reused later if user clicks on 'zoom to see more'
      dispatch({
        type: SET_VESSEL_CLUSTER_CENTER, payload: latLng
      });
      dispatch(showVesselClusterInfo());
    }
  };
}
