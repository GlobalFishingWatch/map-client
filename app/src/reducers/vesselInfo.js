const initialState = {
  track: {},
  details: {}
};
import { SET_VESSEL_DETAILS, SET_VESSEL_TRACK, RESET_VESSEL_DETAILS } from '../actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VESSEL_TRACK:
      return Object.assign({}, state, { track: action.payload });
    case SET_VESSEL_DETAILS: {
      const details = Object.assign({}, state.details, action.payload);
      return Object.assign({}, state, { details });
    }
    case RESET_VESSEL_DETAILS:
      return Object.assign({}, state, { details: action.payload });
    default:
      return state;
  }
}
