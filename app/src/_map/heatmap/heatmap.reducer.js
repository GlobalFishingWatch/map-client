import uniq from 'lodash/uniq';
import {
  INIT_HEATMAP_LAYERS,
  UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES,
  ADD_HEATMAP_LAYER,
  UPDATE_HEATMAP_LAYER_STYLE,
  REMOVE_HEATMAP_LAYER,
  ADD_REFERENCE_TILE,
  REMOVE_REFERENCE_TILE,
  UPDATE_HEATMAP_TILES,
  RELEASE_HEATMAP_TILES,
  HIGHLIGHT_VESSELS,
  UPDATE_LOADED_TILES,
  HIGHLIGHT_CLICKED_VESSEL,
  CLEAR_HIGHLIGHT_CLICKED_VESSEL
} from './heatmap.actions';

const initialState = {
  // a dict of heatmap layers (key is layer id)
  // each containing data, url, tiles, visibleTemporalExtentsIndices
  heatmapLayers: {},
  // store a list of tiles currently visible in the map
  // those are necessary when adding a new layer to know which tiles need to be loaded
  referenceTiles: [],
  highlightedVessels: { isEmpty: true },
  highlightedClickedVessel: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case INIT_HEATMAP_LAYERS: {
      return Object.assign({}, state, { heatmapLayers: action.payload });
    }

    case UPDATE_HEATMAP_LAYER_TEMPORAL_EXTENTS_LOADED_INDICES: {
      const heatmapLayers = state.heatmapLayers;
      let indices = heatmapLayers[action.payload.layerId].visibleTemporalExtentsIndices;
      indices = uniq(indices.concat(action.payload.indicesAdded));
      heatmapLayers[action.payload.layerId].visibleTemporalExtentsIndices = indices;
      return Object.assign({}, state, heatmapLayers);
    }

    case ADD_HEATMAP_LAYER: {
      const heatmapLayers = Object.assign({}, state.heatmapLayers, {
        [action.payload.id]: {
          tiles: [],
          ...action.payload
        }
      });
      return Object.assign({}, state, { heatmapLayers });
    }

    case UPDATE_HEATMAP_LAYER_STYLE: {
      const newLayer = action.payload;
      const layer = { ...state.heatmapLayers[newLayer.id], ...newLayer };
      const heatmapLayers = { ...state.heatmapLayers, [newLayer.id]: layer };
      console.log('heatmap layers in store now', Object.keys(heatmapLayers).map(l => [l, heatmapLayers[l].visible]))
      return { ...state, heatmapLayers };
    }

    case REMOVE_HEATMAP_LAYER: {
      const heatmapLayers = Object.assign({}, state.heatmapLayers);
      delete heatmapLayers[action.payload.layerId];
      return Object.assign({}, state, { heatmapLayers });
    }

    case ADD_REFERENCE_TILE: {
      return Object.assign({}, state, { referenceTiles: [
        ...state.referenceTiles,
        action.payload
      ] });
    }

    case REMOVE_REFERENCE_TILE: {
      const index = state.referenceTiles.findIndex(tile => tile.uid === action.payload);
      return Object.assign({}, state, { referenceTiles: [
        ...state.referenceTiles.slice(0, index),
        ...state.referenceTiles.slice(index + 1)]
      });
    }

    // TODO handle adding layers

    case UPDATE_HEATMAP_TILES: {
      const layerId = action.payload.layerId;
      const newTiles = action.payload.tiles;
      const layer = { ...state.heatmapLayers[layerId], tiles: newTiles };
      const heatmapLayers = { ...state.heatmapLayers, [layerId]: layer };
      console.log('storing new tiles for', layerId, newTiles, layer)
      return { ...state, heatmapLayers };
    }

    case RELEASE_HEATMAP_TILES: {
      const uids = action.payload;
      const layerIds = Object.keys(state.heatmapLayers);
      const heatmapLayers = { ...state.heatmapLayers };
      layerIds.forEach((layerId) => {
        const prevLayer = { ...heatmapLayers[layerId] };
        uids.forEach((tileUid) => {
          const releasedTileIndex = prevLayer.tiles.findIndex(tile => tile.uid === tileUid);
          if (releasedTileIndex > -1) {
            console.log('releasing', layerId, tileUid);
            prevLayer.tiles.splice(releasedTileIndex, 1);
          }
        });
      });
      return { ...state, heatmapLayers };
    }

    case UPDATE_LOADED_TILES: {
      const newHeatmapLayers = { ...state.heatmapLayers };
      return { ...state, heatmapLayers: newHeatmapLayers };
    }

    case HIGHLIGHT_VESSELS: {
      return Object.assign({}, state, { highlightedVessels: action.payload });
    }

    case HIGHLIGHT_CLICKED_VESSEL: {
      return { ...state, highlightedClickedVessel: action.payload };
    }

    case CLEAR_HIGHLIGHT_CLICKED_VESSEL: {
      return { ...state, highlightedClickedVessel: null };
    }

    default:
      return state;
  }
}
