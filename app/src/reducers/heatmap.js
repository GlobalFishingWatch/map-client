import {
  SET_LAYERS,
  ADD_HEATMAP_LAYER,
  REMOVE_HEATMAP_LAYER,
  ADD_REFERENCE_TILE,
  REMOVE_REFERENCE_TILE,
  UPDATE_HEATMAP_TILES
} from '../actions';

const initialState = {
  // a dict of heatmap layers (key is layer id)
  heatmapLayers: {},
  // store a list of tiles currently visible in the map
  // those are necessary when adding a new layer to know which tiles need to be loaded
  referenceTiles: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LAYERS: {
      const heatmapLayers = {};
      action.payload.forEach((layer) => {
        if (layer.type === 'ClusterAnimation' && layer.added === true) {
          heatmapLayers[layer.id] = {
            url: layer.url,
            tiles: []
          };
        }
      });
      return Object.assign({}, state, { heatmapLayers });
    }

    case ADD_HEATMAP_LAYER: {
      const heatmapLayers = Object.assign({}, state.heatmapLayers, {
        [action.payload.layerId]: {
          url: action.payload.url,
          tiles: []
        }
      });
      return Object.assign({}, state, { heatmapLayers });
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
      // fake immutable
      const newHeatmapLayers = action.payload;
      const heatmapLayers = {};
      Object.keys(newHeatmapLayers).forEach((layerId) => {
        heatmapLayers[layerId] = newHeatmapLayers[layerId];
      });
      return Object.assign({}, state, { heatmapLayers });
    }

    default:
      return state;
  }
}
