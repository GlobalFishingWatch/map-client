import {
  SET_LAYERS
} from '../actions';

// a dict of heatmap layers (key is layer id)
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LAYERS: {
      console.log(action.payload);
      const newState = {};
      action.payload.forEach(layer => {
        if (layer.type === 'ClusterAnimation') {
          newState[layer.id] = {
            url: layer.source.args.url,
            tiles: []
          };
        }
      });
      console.log(newState)
      return newState;
    }

    default:
      return state;
  }
}
