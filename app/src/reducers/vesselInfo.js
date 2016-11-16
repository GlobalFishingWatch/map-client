const initialState = {
  track: {},
  details: {},
  vesselPosition: {},
  vesselVisibility: false
};
import {
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  RESET_VESSEL_DETAILS,
  SET_VESSEL_POSITION,
  SET_VESSEL_VISIBILITY,
  SET_TRACK_BOUNDS
} from '../actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VESSEL_TRACK:
      return Object.assign({}, state, { track: action.payload });
    case SET_TRACK_BOUNDS: {
      console.log(action)
      let newState = Object.assign({}, state, { trackBounds: action.trackBounds });
      console.log(newState);
      return newState;
    }
    case SET_VESSEL_DETAILS: {
      const details = Object.assign({}, state.details, action.payload);
      return Object.assign({}, state, { details });
    }
    case RESET_VESSEL_DETAILS:
      return Object.assign({}, state, { details: action.payload });
    case SET_VESSEL_VISIBILITY: {
      return Object.assign({}, state, { vesselVisibility: action.payload });
    }
    case SET_VESSEL_POSITION:
      return Object.assign({}, state, { vesselPosition: action.payload });
    default:
      return state;
  }
}
