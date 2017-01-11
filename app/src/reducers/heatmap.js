import {
  SET_LAYERS,
  UPDATE_HEATMAP_TILES
} from '../actions';

// a dict of heatmap layers (key is layer id)
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LAYERS: {
      const newState = {};
      action.payload.forEach(layer => {
        if (layer.type === 'ClusterAnimation') {
          newState[layer.id] = {
            url: layer.args.source.args.url,
            tiles: []
          };
        }
      });
      return newState;
    }

    case UPDATE_HEATMAP_TILES: {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
}
