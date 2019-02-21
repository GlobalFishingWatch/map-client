import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  getTilePlaybackData,
  selectVesselsAt
} from '../utils/heatmapTileData';
import { ENCOUNTERS } from '../constants';
import { markTileAsLoaded } from './heatmapTiles.actions';
import { startLoader, completeLoader } from '../module/module.actions';

export const ADD_HEATMAP_LAYER = 'ADD_HEATMAP_LAYER';
export const UPDATE_HEATMAP_LAYER_STYLE = 'UPDATE_HEATMAP_LAYER_STYLE';
export const ADD_REFERENCE_TILE = 'ADD_REFERENCE_TILE';
export const HIGHLIGHT_VESSELS = 'HIGHLIGHT_VESSELS';
export const INIT_HEATMAP_LAYERS = 'INIT_HEATMAP_LAYERS';
export const REMOVE_HEATMAP_LAYER = 'REMOVE_HEATMAP_LAYER';
export const UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES = 'UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES';
export const UPDATE_HEATMAP_TILE = 'UPDATE_HEATMAP_TILE';
export const RELEASE_HEATMAP_TILES = 'RELEASE_HEATMAP_TILES';
export const UPDATE_LOADED_TILES = 'UPDATE_LOADED_TILES';
export const HIGHLIGHT_CLICKED_VESSEL = 'HIGHLIGHT_CLICKED_VESSEL';
export const CLEAR_HIGHLIGHT_CLICKED_VESSEL = 'CLEAR_HIGHLIGHT_CLICKED_VESSEL';

/**
 * getTemporalExtentsVisibleIndices - Compares timebar outer extent with temporal extents present on the layer header
 * @param  {array} loadTemporalExtent Current timebar outer extent
 * @param  {array} layerTemporalExtents Temporal extent present on the layer's header (an array of extent arrays)
 * @return {array}                    Indices of the layer's temporal extents that should be visible
 */
function getTemporalExtentsVisibleIndices(loadTemporalExtent, layerTemporalExtents) {
  const currentExtentStart = loadTemporalExtent[0].getTime();
  const currentExtentEnd = loadTemporalExtent[1].getTime();
  const indices = [];
  layerTemporalExtents.forEach((temporalExtent, index) => {
    const temporalExtentStart = temporalExtent[0];
    const temporalExtentEnd = temporalExtent[1];
    if (temporalExtentEnd >= currentExtentStart && temporalExtentStart <= currentExtentEnd) {
      indices.push(index);
    }
  });
  return indices;
}

/**
 * loadLayerTile - loads an heatmap tile.
 *
 * @param  {string} layerId              layer id
 * @param  {object} tileCoordinates      tile coordinates from reference tile
 * @param  {string} token                the user's token
 * @param  {array} temporalExtentsIndices which of the temporal extents from  temporalExtents should be loaded
 * @param  {string} urls                 tile endpoints provided by header
 * @param  {array} temporalExtents       all of the layer's header temporal extents
 * @param  {bool} temporalExtentsLess    true = don't try to load different tiles based on current time extent
 * @param  {bool} isPBF                  true = read tile as MVT + PBF tile, rather than using Pelagos client
 * @return {Promise}                     a Promise that will be resolved when tile is loaded
 */
function loadLayerTile(layerId, tileCoordinates, token, temporalExtentsIndices, { url, temporalExtents, temporalExtentsLess, isPBF }) {
  // console.log('loadLayerTile', layerId, tileCoordinates, temporalExtentsIndices)
  if (url === undefined) {
    throw new Error('URL/endpoints object is not available on this tilesets header');
  }
  const pelagosPromises = getTilePromises(url, token, temporalExtents, {
    tileCoordinates,
    temporalExtentsIndices,
    temporalExtentsLess,
    isPBF
  });
  const allLayerPromises = Promise.all(pelagosPromises);

  const layerTilePromise = new Promise((resolve) => {
    allLayerPromises.then((rawTileData) => {
      resolve({
        loadedLayerId: layerId,
        rawTileData
      });
    });
  });

  return layerTilePromise;
}

/**
 * parseLayerTile - parses an heatmap tile to a playback-ready format.
 *
 * @param  {Object} rawTileData          the raw tile data, loaded either from the pelagos client or as a MVT/PBF vector tile
 * @param  {array} colsByName            names of the columns present in the raw tiles that need to be included in the final playback data
 * @param  {object} tileCoordinates      tile coordinates from reference tile
 * @param  {array} prevPlaybackData      (optional) in case some time extent was already loaded for this tile, append to this data
 * @return {Object}                      playback-ready merged data
 */
function parseLayerTile(rawTileData, colsByName, isPBF, tileCoordinates, prevPlaybackData) {
  let data;
  if (isPBF === true) {
    if (rawTileData === undefined || !rawTileData.length || rawTileData[0] === undefined || !Object.keys(rawTileData[0].layers).length) {
      return [];
    }
    data = rawTileData[0].layers.points;
  } else {
    const cleanVectorArrays = getCleanVectorArrays(rawTileData);
    data = groupData(cleanVectorArrays, Object.keys(colsByName));
    if (Object.keys(data).length === 0) {
      return [];
    }
  }
  const playbackData = getTilePlaybackData(
    data,
    colsByName,
    tileCoordinates,
    isPBF,
    prevPlaybackData
  );
  return playbackData;
}

/**
 * getTiles - loads a bunch of heatmap tiles
 * @param  {array} layerIds                 list of layer Ids that need to be loaded for this/these tiles
 * @param  {array} referenceTiles           list of reference tiles (tile data regardless of layer) that need to be loaded
 * @param  {object} newTemporalExtentsToLoad (optional) a dict (layerId is the key) of temporal extents
 * indices that should be appended to existing data
 */
function getTiles(layerIds, referenceTiles, newTemporalExtentsToLoad = undefined) {
  return (dispatch, getState) => {
    const state = getState();
    const loaderID = startLoader(dispatch, state);
    const token = state.map.module.token;
    const heatmapLayers = state.map.heatmap.heatmapLayers;
    const tilesByLayer = {};
    layerIds.forEach((id) => {
      tilesByLayer[id] = [...heatmapLayers[id].tiles];
    });
    const allPromises = [];

    layerIds.forEach((layerId) => {
      const heatmapLayerHeader = heatmapLayers[layerId].header;
      const { temporalExtents, temporalExtentsLess, isPBF, colsByName } = { ...heatmapLayerHeader };
      const url = heatmapLayerHeader.endpoints.tiles;

      referenceTiles.forEach((referenceTile) => {
        // check if tile does not already exist first
        let tile = tilesByLayer[layerId].find(t => t.uid === referenceTile.uid);
        if (!tile) {
          // console.log('create tile ', referenceTile.uid)
          tile = {
            uid: referenceTile.uid,
            temporalExtentsIndicesLoaded: []
          };
          tilesByLayer[layerId].push(tile);
        } else {
          // console.log('found tile', referenceTile.uid)
        }

        const queriedTemporalExtentsIndices = (newTemporalExtentsToLoad === undefined)
          ? heatmapLayers[layerId].visibleTemporalExtentsIndices
          : newTemporalExtentsToLoad[layerId];

        const temporalExtentsIndicesToLoad = difference(queriedTemporalExtentsIndices, tile.temporalExtentsIndicesLoaded);

        const tilePromise = loadLayerTile(
          layerId,
          referenceTile.tileCoordinates,
          token,
          temporalExtentsIndicesToLoad,
          {
            url,
            temporalExtents,
            temporalExtentsLess,
            isPBF
          }
        );

        allPromises.push(tilePromise);

        tilePromise.then(({ loadedLayerId, rawTileData }) => {
          tile.temporalExtentsIndicesLoaded = uniq(tile.temporalExtentsIndicesLoaded.concat(temporalExtentsIndicesToLoad));
          tile.data = parseLayerTile(
            rawTileData,
            colsByName,
            isPBF,
            referenceTile.tileCoordinates,
            tile.data
          );

          dispatch({
            type: UPDATE_HEATMAP_TILE,
            payload: {
              layerId: loadedLayerId,
              tile
            }
          });
        });
      });
    });

    Promise.all(allPromises).then(() => {
      dispatch(completeLoader(loaderID));
      dispatch(markTileAsLoaded(referenceTiles.map(tile => tile.uid)));
    });
  };
}


/**
 * getTile - This action is emitted when a new tile is queried from panning or zooming the map
 * This will load a tile for all currently visible heatmap layers
 *
 * @param  {object} referenceTile a reference tile containing xyz coords and uid
 */
export function getTile(referenceTile) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_REFERENCE_TILE,
      payload: referenceTile
    });
    const visibleHeatmapLayers = getState().map.heatmap.heatmapLayers;
    const visibleHeatmapLayersIds = Object.keys(visibleHeatmapLayers)
      .filter(id => visibleHeatmapLayers[id].visible === true);

    if (visibleHeatmapLayersIds.length) {
      dispatch(getTiles(visibleHeatmapLayersIds, [referenceTile]));
    }
  };
}


/**
 * releaseTiles - This action is emitted when an existing tile is removed from panning or zooming the map
 * @param  {array} uids tile ref uids to release
 */
export const releaseTiles = uids => ({
  type: RELEASE_HEATMAP_TILES,
  payload: uids
});

export const updateLoadedTiles = () => ({
  type: UPDATE_LOADED_TILES
});

// triggered when a layer is added or set to visible
function loadAllTilesForLayer(layerId) {
  return (dispatch, getState) => {
    //                current layer, all reference tiles
    const referenceTiles = getState().map.heatmap.referenceTiles;
    dispatch(getTiles([layerId], referenceTiles));
  };
}


export const addHeatmapLayer = (layer, loadTemporalExtent) => (dispatch) => {
  const layerTemporalExtents = layer.header.temporalExtents;
  dispatch({
    type: ADD_HEATMAP_LAYER,
    payload: {
      ...layer,
      // initially attach which of the temporal extents indices are visible with initial outerExtent
      visibleTemporalExtentsIndices: getTemporalExtentsVisibleIndices(loadTemporalExtent, layerTemporalExtents)
    }
  });

  if (layer.visible === true) {
    dispatch(loadAllTilesForLayer(layer.id));
  }
};

export const removeHeatmapLayer = id => (dispatch) => {
  dispatch({
    type: REMOVE_HEATMAP_LAYER,
    payload: {
      id
    }
  });
};

/**
 * updateLayerLoadTemporalExtents - when outer time extent changes, checks if more tiles needs to be loaded
 * by comparing the outer time range with the temporalExtent already loaded on each layer.
 * @param  {array} loadTemporalExtent Current app-wide extent of tiles that need to load, expressed
 * as an array of two dates
 */
export function updateLayerLoadTemporalExtents(loadTemporalExtent) {
  return (dispatch, getState) => {
    const state = getState();
    const heatmapLayers = state.map.heatmap.heatmapLayers;
    const indicesToAddByLayer = {};
    Object.keys(heatmapLayers).forEach((layerId) => {
      const heatmapLayer = heatmapLayers[layerId];
      const temporalExtents = heatmapLayer.header.temporalExtents;
      const oldVisibleTemporalExtentsIndices = heatmapLayer.visibleTemporalExtentsIndices;
      const newVisibleTemporalExtentsIndices = getTemporalExtentsVisibleIndices(loadTemporalExtent, temporalExtents);
      const indicesAdded = difference(newVisibleTemporalExtentsIndices, oldVisibleTemporalExtentsIndices);

      if (indicesAdded.length) {
        // add new loaded indices to heatmap layer if applicable
        indicesToAddByLayer[layerId] = indicesAdded;
        dispatch({
          type: UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES,
          payload: {
            layerId,
            indicesAdded
          }
        });
      }
    });

    // getTiles with indices diff
    const layerIdsWithIndicesToAdd = Object.keys(indicesToAddByLayer);
    if (layerIdsWithIndicesToAdd.length) {
      dispatch(getTiles(layerIdsWithIndicesToAdd, state.map.heatmap.referenceTiles, indicesToAddByLayer));
    }
  };
}

/**
 * Returns clusters or vessels data from a tileQuery
 * @param {object} state - the application state
 * @param {string} tileQuery - the id of a heatmap layer
 * @return {object} { isEmpty, isCluster, isMouseCluster, foundVessels, layerId, tilesetId }
 */
const _queryHeatmap = (state, tileQuery, temporalExtentIndexes) => {
  const layers = state.map.heatmap.heatmapLayers;
  const startIndex = temporalExtentIndexes[0];
  const endIndex = temporalExtentIndexes[1];
  const layersVessels = [];

  Object.keys(layers).forEach((layerId) => {
    const layer = layers[layerId];
    const allPossibleTilesByPreference = tileQuery.uids.map(uid => layer.tiles.find(tile => tile.uid === uid));
    const availableTiles = allPossibleTilesByPreference.filter(tile => tile !== undefined && tile.data !== undefined);

    const currentFilters = layer.filters;
    if (availableTiles.length) {
      const bestTile = availableTiles[0];
      layersVessels.push({
        layer,
        vessels: selectVesselsAt(bestTile.data, tileQuery, startIndex, endIndex, currentFilters)
      });
    }

  });

  const layersVesselsResults = layersVessels.filter(layerVessels => layerVessels.vessels.length > 0);

  // it's a cluster because of aggregation on the server side
  let isCluster;
  // its a cluster because or multiple vessels under mouse
  let isMouseCluster;
  let isEmpty;
  let layerVesselsResult;
  let foundVessels;

  const hasEncounters = layersVesselsResults.filter(layerVessel => layerVessel.layer.subtype === ENCOUNTERS).length > 0;

  if (layersVesselsResults.length === 0) {
    isEmpty = true;
  } else if (layersVesselsResults.length > 1 && !hasEncounters) {
    // if there are points over multiple layers, consider this a cluster (ie don't select, zoom instead, or don't highlight)
    // there's an exception if vessel selection contains an encounter, in which case it will take priority
    isCluster = true;
  } else {
    // if we have a hit with an encounters layer, use it in priority
    // if not the layersVesselsResults should contain a single result
    layerVesselsResult = (hasEncounters) ?
      layersVesselsResults.find(layerVessel => layerVessel.layer.subtype === ENCOUNTERS) :
      layersVesselsResults[0];

    // we can get multiple points with similar series and seriesgroup, in which case
    // we should treat that as a successful vessel query, not a cluster
    const vessels = layerVesselsResult.vessels;

    if (vessels.length === 0) {
      isEmpty = true;
    } else {
      // look up for any negatives seriesgroup (clusters on the server side)
      const clusteredVessels = vessels.filter(v => v.seriesgroup < 0);
      if (clusteredVessels.length) {
        isCluster = true;
      } else {
        foundVessels = uniqBy(vessels, v => v.series);
        isMouseCluster = foundVessels.length > 1;
      }
    }
  }

  const layer = (layerVesselsResult === undefined) ? {} : layerVesselsResult.layer;

  return { isEmpty, isCluster, isMouseCluster, foundVessels, layer };
};

export function clearHighlightedVessels() {
  return {
    type: HIGHLIGHT_VESSELS,
    payload: {
      isEmpty: true,
      clickableCluster: false
    }
  };
}

export function highlightVesselFromHeatmap(tileQuery, temporalExtentIndexes) {
  return (dispatch, getState) => {
    const state = getState();
    const { layer, isEmpty, isCluster, isMouseCluster, foundVessels } =
      _queryHeatmap(state, tileQuery, temporalExtentIndexes);

    if (layer.id !== undefined || state.map.heatmap.highlightedVessels.layerId !== layer.id) {
      dispatch({
        type: HIGHLIGHT_VESSELS,
        payload: {
          layer: {
            id: layer.id,
            tilesetId: layer.tilesetId,
            subtype: layer.subtype,
            header: layer.header
          },
          isEmpty,
          clickableCluster: isCluster === true || isMouseCluster === true,
          highlightableCluster: isCluster !== true,
          foundVessels
        }
      });
    } else {
      dispatch(clearHighlightedVessels());
    }
  };
}

export const highlightClickedVessel = (seriesgroup, layerId) => ({
  type: HIGHLIGHT_CLICKED_VESSEL,
  payload: {
    seriesgroup,
    layerId
  }
});

export const clearHighlightedClickedVessel = () => ({
  type: CLEAR_HIGHLIGHT_CLICKED_VESSEL
});

export const updateHeatmapLayers = (newLayers, currentLoadTemporalExtent) => (dispatch, getState) => {
  const prevLayersDict = getState().map.heatmap.heatmapLayers;

  // add and update layers
  newLayers.forEach((newLayer) => {
    const layerId = newLayer.id;
    const prevLayer = prevLayersDict[layerId];
    if (prevLayer === undefined) {
      // console.log('adding', layerId)
      dispatch(addHeatmapLayer(newLayer, currentLoadTemporalExtent));
    } else {
      if (prevLayer.visible !== newLayer.visible && newLayer.visible === true) {
        dispatch(loadAllTilesForLayer(layerId));
      }
      if (
        prevLayer.visible !== newLayer.visible ||
        prevLayer.hue !== newLayer.hue ||
        prevLayer.opacity !== newLayer.opacity ||
        prevLayer.filters !== newLayer.filters ||
        prevLayer.interactive !== newLayer.interactive
      ) {
        // console.log('updating', layerId, ' with visibilty', newLayer.visible)
        dispatch({
          type: UPDATE_HEATMAP_LAYER_STYLE,
          payload: {
            id: newLayer.id,
            visible: newLayer.visible,
            hue: newLayer.hue,
            opacity: newLayer.opacity,
            filters: newLayer.filters,
            interactive: newLayer.interactive
          }
        });
      }
    }
  });

  // clean up unused layers
  Object.keys(prevLayersDict).forEach((prevLayerId) => {
    if (!newLayers.find(l => l.id === prevLayerId)) {
      dispatch(removeHeatmapLayer(prevLayerId));
    }
  });
};
