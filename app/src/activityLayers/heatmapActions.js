import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  getTilePlaybackData,
  selectVesselsAt
} from 'utils/heatmapTileData';
import { LOADERS } from 'config';
import { LAYER_TYPES } from 'constants';
import { clearVesselInfo, addVessel, hideVesselsInfoPanel } from 'vesselInfo/vesselInfoActions';
import { setEncountersInfo, clearEncountersInfo } from 'encounters/encountersActions';
import { trackMapClicked } from 'analytics/analyticsActions';
import { addLoader, removeLoader, zoomIntoVesselCenter } from 'actions/map';
import { updateHeatmapTilesFromViewport } from 'activityLayers/heatmapTilesActions';

export const ADD_HEATMAP_LAYER = 'ADD_HEATMAP_LAYER';
export const ADD_REFERENCE_TILE = 'ADD_REFERENCE_TILE';
export const HIGHLIGHT_VESSELS = 'HIGHLIGHT_VESSELS';
export const INIT_HEATMAP_LAYERS = 'INIT_HEATMAP_LAYERS';
export const REMOVE_HEATMAP_LAYER = 'REMOVE_HEATMAP_LAYER';
export const REMOVE_REFERENCE_TILE = 'REMOVE_REFERENCE_TILE';
export const UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES = 'UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES';
export const UPDATE_HEATMAP_TILES = 'UPDATE_HEATMAP_TILES';

/**
 * getTemporalExtentsVisibleIndices - Compares timebar outer extent with temporal extents present on the layer header
 * @param  {array} currentOuterExtent Current timebar outer extent
 * @param  {array} temporalExtents    Temporal extents present on the layer's header (an array of extent arrays)
 * @return {array}                    Indices of the layer's temporal extents that should be visible
 */
function getTemporalExtentsVisibleIndices(currentOuterExtent, temporalExtents) {
  const currentExtentStart = currentOuterExtent[0].getTime();
  const currentExtentEnd = currentOuterExtent[1].getTime();
  const indices = [];
  temporalExtents.forEach((temporalExtent, index) => {
    const temporalExtentStart = temporalExtent[0];
    const temporalExtentEnd = temporalExtent[1];
    if (temporalExtentEnd >= currentExtentStart && temporalExtentStart <= currentExtentEnd) {
      indices.push(index);
    }
  });
  return indices;
}


/**
 * initHeatmapLayers - Creates the base reducer state, extracting heatmap layers from all layers
 */
export function initHeatmapLayers() {
  return (dispatch, getState) => {
    const currentOuterExtent = getState().filters.timelineOuterExtent;
    const workspaceLayers = getState().layers.workspaceLayers;
    const heatmapLayers = {};

    workspaceLayers.forEach((workspaceLayer) => {
      if (workspaceLayer.type === LAYER_TYPES.Heatmap && workspaceLayer.added === true) {
        heatmapLayers[workspaceLayer.id] = {
          url: workspaceLayer.url,
          tiles: [],
          tilesetId: workspaceLayer.tilesetId,
          subtype: workspaceLayer.subtype,
          // initially attach which of the temporal extents indices are visible with initial outerExtent
          visibleTemporalExtentsIndices: getTemporalExtentsVisibleIndices(currentOuterExtent, workspaceLayer.header.temporalExtents)
        };
      }
    });

    dispatch({
      type: INIT_HEATMAP_LAYERS,
      payload: heatmapLayers
    });

    dispatch(updateHeatmapTilesFromViewport(true));
  };
}


/**
 * loadLayerTile - loads an heatmap tile.
 *
 * @param  {object} tileCoordinates      tile coordinates from reference tile
 * @param  {string} token                the user's token
 * @param  {array} temporalExtentsIndices which of the temporal extents from  temporalExtents should be loaded
 * @param  {string} urls                 tile endpoints provided by header
 * @param  {array} temporalExtents       all of the layer's header temporal extents
 * @param  {bool} temporalExtentsLess    true = don't try to load different tiles based on current time extent
 * @param  {bool} isPBF                  true = read tile as MVT + PBF tile, rather than using Pelagos client
 * @return {Promise}                     a Promise that will be resolved when tile is loaded
 */
function loadLayerTile(tileCoordinates, token, temporalExtentsIndices, { endpoints, temporalExtents, temporalExtentsLess, isPBF }) {
  const url = endpoints.tiles;
  const pelagosPromises = getTilePromises(url, token, temporalExtents, {
    tileCoordinates,
    temporalExtentsIndices,
    temporalExtentsLess,
    isPBF
  });
  const allLayerPromises = Promise.all(pelagosPromises);

  const layerTilePromise = new Promise((resolve) => {
    allLayerPromises.then((rawTileData) => {
      resolve(rawTileData);
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
 * @param  {object} map                  a reference to the Google Map object. This is required to access projection data.
 * @param  {array} prevPlaybackData      (optional) in case some time extent was already loaded for this tile, append to this data
 * @return {Object}                      playback-ready merged data
 */
function parseLayerTile(rawTileData, colsByName, isPBF, tileCoordinates, map, prevPlaybackData) {
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
 * @param  {object} newTemporalExtentsToLoad (optional) a dict (layerId is the key) of temporal extents indices that should be
 * appended to existing data
 */
function getTiles(layerIds, referenceTiles, newTemporalExtentsToLoad = undefined) {
  return (dispatch, getState) => {
    const loaderId = LOADERS.HEATMAP_TILES + new Date().getTime();
    dispatch(addLoader(loaderId));
    const layers = getState().heatmap.heatmapLayers;
    const token = getState().user.token;
    const map = getState().map.googleMaps;
    const allPromises = [];

    layerIds.forEach((layerId) => {
      const workspaceLayers = getState().layers.workspaceLayers;
      const workspaceLayer = workspaceLayers.find(layer => layer.id === layerId);
      const layerHeader = workspaceLayer.header;
      if (!layerHeader) {
        console.warn('no header has been set on this heatmap layer');
      }
      referenceTiles.forEach((referenceTile) => {
        // check if tile does not already exist first
        let tile = layers[layerId].tiles.find(t => t.uid === referenceTile.uid);
        if (!tile) {
          tile = {
            uid: referenceTile.uid,
            temporalExtentsIndicesLoaded: []
          };
          layers[layerId].tiles.push(tile);
        }

        const queriedTemporalExtentsIndices = (newTemporalExtentsToLoad === undefined)
          ? layers[layerId].visibleTemporalExtentsIndices
          : newTemporalExtentsToLoad[layerId];

        const temporalExtentsIndicesToLoad = difference(queriedTemporalExtentsIndices, tile.temporalExtentsIndicesLoaded);

        const tilePromise = loadLayerTile(
          referenceTile.tileCoordinates,
          token,
          temporalExtentsIndicesToLoad,
          layerHeader
        );

        allPromises.push(tilePromise);

        tilePromise.then((rawTileData) => {
          tile.temporalExtentsIndicesLoaded = uniq(tile.temporalExtentsIndicesLoaded.concat(temporalExtentsIndicesToLoad));
          tile.data = parseLayerTile(
            rawTileData,
            layerHeader.colsByName,
            layerHeader.isPBF,
            referenceTile.tileCoordinates,
            map,
            tile.data
          );
          dispatch({
            type: UPDATE_HEATMAP_TILES, payload: layers
          });
        });
      });
    });

    Promise.all(allPromises).then(() => {
      dispatch(removeLoader(loaderId));
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
    const visibleHeatmapLayers = getState().layers.workspaceLayers.filter(workspaceLayer =>
      workspaceLayer.type === LAYER_TYPES.Heatmap && workspaceLayer.added === true && workspaceLayer.visible === true)
      .map(layer => layer.id);

    if (visibleHeatmapLayers.length) {
      dispatch(getTiles(visibleHeatmapLayers, [referenceTile]));
    }
  };
}


/**
 * releaseTiles - This action is emitted when an existing tile is removed from panning or zooming the map
 * @param  {array} uids tile ref uids to release
 */
export function releaseTiles(uids) {
  return (dispatch, getState) => {
    const layers = getState().heatmap.heatmapLayers;
    uids.forEach(uid => {
      dispatch({
        type: REMOVE_REFERENCE_TILE,
        payload: uid
      });

      // TODO Do that in the reducer!
      Object.keys(layers).forEach((layerId) => {
        const layer = layers[layerId];
        const tiles = layer.tiles;
        const releasedTileIndex = tiles.findIndex(tile => tile.uid === uid);
        if (releasedTileIndex === -1) {
          return;
        }
        tiles.splice(releasedTileIndex, 1);
      });
    });

    dispatch({
      type: UPDATE_HEATMAP_TILES, payload: layers
    });
  };
}


export function loadAllTilesForLayer(layerId) {
  return (dispatch, getState) => {
    //                current layer, all reference tiles
    dispatch(getTiles([layerId], getState().heatmap.referenceTiles));
  };
}


export function addHeatmapLayerFromLibrary(layerId, url) {
  return (dispatch) => {
    dispatch({
      type: ADD_HEATMAP_LAYER,
      payload: {
        layerId,
        url
      }
    });

    dispatch(loadAllTilesForLayer(layerId));
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

/**
 * loadTilesExtraTimeRange - when outer time extent changes, checks if more tiles needs to be loaded
 * by comparing the outer time range with the temporalExtent already loaded on each layer
 */
export function loadTilesExtraTimeRange() {
  return (dispatch, getState) => {
    const currentOuterExtent = getState().filters.timelineOuterExtent;
    const heatmapLayers = getState().heatmap.heatmapLayers;
    const layersToUpdate = {};
    Object.keys(heatmapLayers).forEach((layerId) => {
      const workspaceLayer = getState().layers.workspaceLayers.find(layer => layer.id === layerId);
      const heatmapLayer = heatmapLayers[layerId];
      const oldVisibleTemporalExtents = heatmapLayer.visibleTemporalExtentsIndices;
      const newVisibleTemporalExtents = getTemporalExtentsVisibleIndices(currentOuterExtent, workspaceLayer.header.temporalExtents);
      const diff = difference(newVisibleTemporalExtents, oldVisibleTemporalExtents);
      if (diff.length) {
        // add new loaded indices to heatmap layer if applicable
        layersToUpdate[layerId] = diff;
        dispatch({
          type: UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES,
          payload: {
            layerId,
            diff
          }
        });
      }
    });

    // getTiles with indices diff
    if (Object.keys(layersToUpdate).length) {
      dispatch(getTiles(Object.keys(layersToUpdate), getState().heatmap.referenceTiles, layersToUpdate));
    }
  };
}

/**
 * Gets all the categories for all the filters of a Heatmap layer
 * @param {object} state - the application state
 * @param {string} layerId - the id of a heatmap layer
 * @return {array} categories
 */
const _getCurrentFiltersForLayer = (state, layerId) => {
  if (layerId === undefined) return undefined;
  return state.filterGroups.layerFilters[layerId];
};

/**
 * Returns clusters or vessels data from a tileQuery
 * @param {object} state - the application state
 * @param {string} tileQuery - the id of a heatmap layer
 * @return {object} { isEmpty, isCluster, isMouseCluster, foundVessels, layerId, tilesetId }
 */
const _queryHeatmap = (state, tileQuery) => {
  const layers = state.heatmap.heatmapLayers;
  const timelineExtent = state.filters.timelineInnerExtentIndexes;
  const startIndex = timelineExtent[0];
  const endIndex = timelineExtent[1];
  const layersVessels = [];

  Object.keys(layers).forEach((layerId) => {
    const workspaceLayer = state.layers.workspaceLayers.find(l => l.id === layerId);
    if (workspaceLayer.added === true && workspaceLayer.visible === true) {
      const layer = layers[layerId];
      const queriedTile = layer.tiles.find(tile => tile.uid === tileQuery.uid);
      const currentFilters = _getCurrentFiltersForLayer(state, layerId);
      if (queriedTile !== undefined && queriedTile.data !== undefined) {
        layersVessels.push({
          layer: workspaceLayer,
          vessels: selectVesselsAt(queriedTile.data, tileQuery, startIndex, endIndex, currentFilters)
        });
      }
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

  const hasEncounters = layersVesselsResults.filter(layerVessel => layerVessel.layer.subtype === LAYER_TYPES.Encounters).length > 0;

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
      layersVesselsResults.find(layerVessel => layerVessel.layer.subtype === LAYER_TYPES.Encounters) :
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

export function highlightVesselFromHeatmap(tileQuery, latLng) {
  return (dispatch, getState) => {
    const state = getState();
    const { layer, isEmpty, isCluster, isMouseCluster, foundVessels } = _queryHeatmap(state, tileQuery);

    if (layer.id !== undefined || state.heatmap.highlightedVessels.layerId !== layer.id) {
      dispatch({
        type: HIGHLIGHT_VESSELS,
        payload: {
          layerId: layer.id,
          isEmpty,
          clickableCluster: isCluster === true || isMouseCluster === true,
          highlightableCluster: isCluster !== true,
          foundVessels,
          latLng
        }
      });
    }
  };
}

export function clearHighlightedVessels() {
  return {
    type: HIGHLIGHT_VESSELS,
    payload: {
      isEmpty: true,
      clickableCluster: false
    }
  };
}

export function getVesselFromHeatmap(tileQuery) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.user.userPermissions !== null && state.user.userPermissions.indexOf('selectVessel') === -1) {
      return;
    }

    const { layer, isEmpty, isCluster, isMouseCluster, foundVessels } = _queryHeatmap(state, tileQuery);

    dispatch(clearVesselInfo());
    dispatch(clearEncountersInfo());

    // console.log(isCluster, isMouseCluster, foundVessels)

    if (isEmpty === true) {
      // nothing to see here
    } else if (isCluster === true || isMouseCluster === true) {
      dispatch(trackMapClicked(tileQuery.latitude, tileQuery.longitude, 'cluster'));
      dispatch(hideVesselsInfoPanel());
      dispatch(zoomIntoVesselCenter(tileQuery.latitude, tileQuery.longitude));
      dispatch({
        type: HIGHLIGHT_VESSELS,
        payload: { isEmpty: true }
      });
    } else {
      dispatch(trackMapClicked(tileQuery.latitude, tileQuery.longitude, 'vessel'));
      const selectedSeries = foundVessels[0].series;
      const selectedSeriesgroup = foundVessels[0].seriesgroup;

      if (layer.subtype === LAYER_TYPES.Encounters) {
        if (layer.header.endpoints === undefined || layer.header.endpoints.info === undefined) {
          console.warn('Info field is missing on header\'s urls, can\'t display encounters details');
        } else {
          dispatch(setEncountersInfo(selectedSeries, layer.tilesetId, layer.header.endpoints.info));
        }
      } else {
        dispatch(addVessel(layer.tilesetId, selectedSeriesgroup, selectedSeries));
      }

    }
  };
}
