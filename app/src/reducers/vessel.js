const initialState = {
  loading: false,
  layers: []
};
import {VESSEL_INIT, SHOW_LOADING, UPDATE_LAYER, GET_LAYERS} from '../constants';

export default function (state = initialState, action) {
  switch (action.type) {
    case VESSEL_INIT:
      return Object.assign({}, state, action.payload);
    case SHOW_LOADING:
      return Object.assign({}, state, {loading: action.payload.data});
    case GET_LAYERS:
      return Object.assign({}, state, {layers: state.layers.concat(action.payload)});
    case UPDATE_LAYER:
      const layers = state.layers.slice(0);
      for(let i = 0, length = layers.length; i < length; i++) {
        if(layers[i].title === action.payload.title){
          layers[i] = action.payload;
          break;
        }
      }
      return Object.assign({}, state, {layers});
    default:
      return state;
  }
};
