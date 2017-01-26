import {
  SET_LAYERS,
  UPDATE_HEATMAP_TILES
} from '../actions';

const initialState = {
  // a dict of heatmap layers (key is layer id)
  heatmapLayers: {}
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
