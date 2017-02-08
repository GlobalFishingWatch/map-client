import _ from 'lodash';
import {
  UPDATE_HEATMAP_TILES,
  COMPLETE_TILE_LOAD,
  SET_VESSEL_CLUSTER_CENTER,
  ADD_REFERENCE_TILE,
  REMOVE_REFERENCE_TILE,
  ADD_HEATMAP_LAYER,
  REMOVE_HEATMAP_LAYER
} from 'actions';
import {
  getTilePelagosPromises,
  getCleanVectorArrays,
  groupData,
  addTilePixelCoordinates,
  getTilePlaybackData,
  selectVesselsAt
} from 'actions/helpers/heatmapTileData';
import { clearVesselInfo, showNoVesselsInfo, addVessel, showVesselClusterInfo } from 'actions/vesselInfo';
import { trackMapClicked } from 'actions/analytics';


function loadLayerTile(referenceTile, layerUrl, token, map, temporalExtents, columns) {
  const tileCoordinates = referenceTile.tileCoordinates;
  const pelagosPromises = getTilePelagosPromises(layerUrl, token, temporalExtents, { tileCoordinates });
  const allLayerPromises = Promise.all(pelagosPromises);

  const layerTilePromise = new Promise((resolve) => {
    allLayerPromises.then((rawTileData) => {
      const cleanVectorArrays = getCleanVectorArrays(rawTileData);
      const groupedData = groupData(cleanVectorArrays, columns);
      const bounds = referenceTile.canvas.getBoundingClientRect();
      const vectorArray = addTilePixelCoordinates(groupedData, map, bounds);
      const data = getTilePlaybackData(
        tileCoordinates.zoom,
        vectorArray,
        columns
      );
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
          Object.keys(layerHeader.colsByName)
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
        vessels: selectVesselsAt(queriedTile.data, tileQuery.localX, tileQuery.localY, startIndex, endIndex)
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
