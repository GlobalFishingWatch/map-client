import _ from 'lodash';
import {
  UPDATE_HEATMAP_TILES,
  COMPLETE_TILE_LOAD,
  SET_VESSEL_CLUSTER_CENTER,
  ADD_REFERENCE_TILE,
  REMOVE_REFERENCE_TILE,
  ADD_HEATMAP_LAYER,
  REMOVE_HEATMAP_LAYER,
  INIT_HEATMAP_LAYERS
} from 'actions';
import {
  getTilePelagosPromises,
  getCleanVectorArrays,
  groupData,
  addWorldCoordinates,
  getTilePlaybackData,
  selectVesselsAt
} from 'actions/helpers/heatmapTileData';
import { LAYER_TYPES } from 'constants';
import { clearVesselInfo, showNoVesselsInfo, addVessel, showVesselClusterInfo } from 'actions/vesselInfo';
import { trackMapClicked } from 'actions/analytics';


export function initHeatmapLayers() {
  return (dispatch, getState) => {
    const currentOuterExtent = getState().filters.timelineOuterExtent;
    const currentExtentStart = currentOuterExtent[0].getTime();
    const currentExtentEnd = currentOuterExtent[1].getTime();

    const workspaceLayers = getState().layers.workspaceLayers;

    const heatmapLayers = {};

    workspaceLayers.forEach((workspaceLayer) => {
      if (workspaceLayer.type === LAYER_TYPES.Heatmap && workspaceLayer.added === true) {
        heatmapLayers[workspaceLayer.id] = {
          url: workspaceLayer.url,
          tiles: [],
          temporalExtentsLoadedIndices: []
        };
        workspaceLayer.header.temporalExtents.forEach((temporalExtents, index) => {
          const temporalExtentStart = temporalExtents[0];
          const temporalExtentEnd = temporalExtents[1];
          if (temporalExtentEnd >= currentExtentStart && temporalExtentStart <= currentExtentEnd) {
            heatmapLayers[workspaceLayer.id].temporalExtentsLoadedIndices.push(index);
          }
        });
      }
    });

    dispatch({
      type: INIT_HEATMAP_LAYERS,
      payload: heatmapLayers
    });
  };
}

function loadLayerTile(referenceTile, layerUrl, token, map, temporalExtents, temporalExtentsLoadedIndices) {
  const tileCoordinates = referenceTile.tileCoordinates;
  // TODO pass temporal extents indexes
  const pelagosPromises = getTilePelagosPromises(layerUrl, token, temporalExtents, { tileCoordinates, temporalExtentsLoadedIndices });
  const allLayerPromises = Promise.all(pelagosPromises);

  const layerTilePromise = new Promise((resolve) => {
    allLayerPromises.then((rawTileData) => {
      const cleanVectorArrays = getCleanVectorArrays(rawTileData);
      const groupedData = groupData(cleanVectorArrays);
      const vectorArray = addWorldCoordinates(groupedData, map);
      const data = getTilePlaybackData(
        tileCoordinates.zoom,
        vectorArray
      );
      // console.log(data)
      resolve(data);
    });
  });

  return layerTilePromise;
}

function getTiles(layerIds, referenceTiles) {
  return (dispatch, getState) => {
    const layers = getState().heatmap.heatmapLayers;
    const token = getState().user.token;
    const map = getState().map.googleMaps;
    const allPromises = [];

    layerIds.forEach((layerId) => {
      const workspaceLayer = getState().layers.workspaceLayers.find(layer => layer.id === layerId);
      const layerHeader = workspaceLayer.header;
      if (!layerHeader) {
        console.warn('no header has been set on this heatmap layer');
      }
      referenceTiles.forEach((referenceTile) => {
        const tile = {
          uid: referenceTile.uid,
          canvas: referenceTile.canvas
        };
        layers[layerId].tiles.push(tile);
        const tilePromise = loadLayerTile(
          referenceTile,
          // TODO use URL from header
          layers[layerId].url,
          token,
          map,
          layerHeader.temporalExtents,
          layers[layerId].temporalExtentsLoadedIndices
        );
        allPromises.push(tilePromise);
        tilePromise.then((data) => {
          tile.data = data;
          dispatch({
            type: UPDATE_HEATMAP_TILES, payload: layers
          });
        });
      });
    });

    Promise.all(allPromises).then(() => {
      // TODO this does nothing for now, use it for loading status indicators
      dispatch({
        type: COMPLETE_TILE_LOAD
      });
    });
  };
}


export function getTile(uid, tileCoordinates, canvas) {
  return (dispatch, getState) => {
    const referenceTile = {
      uid,
      tileCoordinates,
      canvas
    };

    dispatch({
      type: ADD_REFERENCE_TILE,
      payload: referenceTile
    });

    dispatch(getTiles(Object.keys(getState().heatmap.heatmapLayers), [referenceTile]));
  };
}

export function releaseTile(uid) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_REFERENCE_TILE,
      payload: uid
    });

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


export function addHeatmapLayerFromLibrary(layerId, url) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_HEATMAP_LAYER,
      payload: {
        layerId,
        url
      }
    });

    dispatch(getTiles([layerId], getState().heatmap.referenceTiles));
  };
}

export function removeHeatmapLayerFromLibrary(id) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_HEATMAP_LAYER,
      payload: {
        id
      }
    });
  };
}

export function loadTilesExtraTimeRange(dates) {
  // TODO
  // for each layer
    // get temporalExtentsIndexesLoaded
    // compare with dates and see if more needs to be loaded
    // loop through ref tiles
      // loadLayerTile with only temporalExtentsIndexes NOT LOADED
      // merge data from new tile with existing dataset :
      // go through all frames, point to new data at index
}

export function queryHeatmap(tileQuery, latLng) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.user.userPermissions.indexOf('selectVessel') === -1) {
      return;
    }

    const layers = state.heatmap.heatmapLayers;
    const timelineExtent = state.filters.timelineInnerExtentIndexes;
    const startIndex = timelineExtent[0];
    const endIndex = timelineExtent[1];
    const layersVessels = [];
    Object.keys(layers).forEach((layerId) => {
      const layer = layers[layerId];
      const queriedTile = layer.tiles.find(tile => tile.uid === tileQuery.uid);
      layersVessels.push({
        layerId,
        vessels: selectVesselsAt(queriedTile.data, state.map.zoom, tileQuery.worldX, tileQuery.worldY, startIndex, endIndex)
      });
    });

    const layersVesselsResult = layersVessels.filter(layerVessels => layerVessels.vessels.length > 0);

    let isCluster;
    let isEmpty;
    let seriesgroup;
    let series;
    let layerId;

    if (layersVesselsResult.length === 0) {
      isEmpty = true;
    } else if (layersVesselsResult.length > 1) {
      // if there are points over multiple layers, consider this a cluster
      isCluster = true;
    } else {
      // we can get multiple points with similar series and seriesgroup, in which case
      // we should treat that as a successful vessel query, not a cluster
      layerId = layersVesselsResult[0].layerId;
      const vessels = layersVesselsResult[0].vessels;
      const allSeriesGroups = _.uniq(vessels.map(v => v.seriesgroup));
      const allSeries = _.uniq(vessels.map(v => v.series));
      seriesgroup = allSeriesGroups[0];
      series = allSeries[0];

      if (vessels.length === 0) {
        isEmpty = true;
      } else if (allSeriesGroups.length > 1 || allSeries.length > 1 || seriesgroup <= 0) {
        // one seriesGroup, one series, and seriesGroup is > 0
        // (less than 0 means that points have been clustered server side)
        isCluster = true;
        if (allSeriesGroups[0] <= 0) {
          console.warn('negative seriesgroup:', allSeriesGroups[0]);
        }
      }
    }


    dispatch(clearVesselInfo());

    if (isEmpty === true) {
      dispatch(showNoVesselsInfo());
    } else if (isCluster === true) {
      dispatch(trackMapClicked(latLng.lat(), latLng.lng(), 'cluster'));
      // the following solely sets the cluster center in the state to be
      // reused later if user clicks on 'zoom to see more'
      dispatch({
        type: SET_VESSEL_CLUSTER_CENTER, payload: latLng
      });
      dispatch(showVesselClusterInfo());
    } else {
      dispatch(trackMapClicked(latLng.lat(), latLng.lng(), 'vessel'));
      dispatch(addVessel(layerId, seriesgroup, series));
    }
  };
}
