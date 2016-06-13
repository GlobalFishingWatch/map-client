const initialState = {
  data: null,
  loading: false,
  layers: []
};
import {VESSEL_INIT, VESSEL_ZOOM_UPDATE, VESSEL_TILE_LOADED, SHOW_LOADING, RESET_CACHE, ADD_LAYER} from '../constants';

export default function(state = initialState, action){
  switch (action.type) {
    case VESSEL_INIT:
      return Object.assign({}, state, action.payload);
    case VESSEL_ZOOM_UPDATE:
    case RESET_CACHE:
      return Object.assign({}, state, {data: null});
    case VESSEL_TILE_LOADED:
      return Object.assign({}, state, {data: Object.assign({}, state.data, action.payload.data)});
    case SHOW_LOADING:
      return Object.assign({}, state, {loading: action.payload.data});
    case ADD_LAYER:
      return Object.assign({}, state, {layers: state.layers.concat(action.payload)});
    default:
      return state;
  }
};
