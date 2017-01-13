const initialState = {
  track: {},
  details: null
};
import {
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  CLEAR_VESSEL_INFO,
  SET_TRACK_BOUNDS,
  SHOW_VESSEL_CLUSTER_INFO,
  SHOW_NO_VESSELS_INFO,
  SHOW_VESSEL_LOADING_INFO
} from 'actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VESSEL_TRACK:
      return Object.assign({}, state, { track: action.payload });
    case SET_VESSEL_DETAILS:
      return Object.assign({}, state, { details: action.payload });
    case CLEAR_VESSEL_INFO:
      return Object.assign({}, state, { details: null });
    case SHOW_VESSEL_CLUSTER_INFO:
      return Object.assign({}, state, { details: { isCluster: true } });
    case SHOW_VESSEL_LOADING_INFO:
      return Object.assign({}, state, { details: { isLoading: true } });
    case SHOW_NO_VESSELS_INFO:
      return Object.assign({}, state, { details: { isEmpty: true } });
    case SET_TRACK_BOUNDS: {
      return Object.assign({}, state, { trackBounds: action.trackBounds });
    }
    default:
      return state;
  }
}
