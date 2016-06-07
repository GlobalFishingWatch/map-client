const initialState = {};
import {VESSEL_INIT, VESSEL_ZOOM_UPDATE} from '../constants';

export default function(state = initialState, action){
  switch (action.type) {
    case VESSEL_INIT:
      return Object.assign({}, state, action.payload);
    case VESSEL_ZOOM_UPDATE:
      return state;

    default:
      return state;
  }
};
