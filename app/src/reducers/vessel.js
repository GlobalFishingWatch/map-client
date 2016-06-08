const initialState = {
  data: null
};
import {VESSEL_INIT, VESSEL_ZOOM_UPDATE, VESSEL_TILE_LOADED} from '../constants';

export default function(state = initialState, action){
  switch (action.type) {
    case VESSEL_INIT:
      return Object.assign({}, state, action.payload);
    case VESSEL_ZOOM_UPDATE:
      return Object.assign({}, state, {data: null});
    case VESSEL_TILE_LOADED:
      return Object.assign({}, state, {data: Object.assign({}, state.data, action.payload.data)});
    default:
      return state;
  }
};
