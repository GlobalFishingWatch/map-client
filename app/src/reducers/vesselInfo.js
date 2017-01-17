import _ from 'lodash';

import {
  ADD_VESSEL,
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  CLEAR_VESSEL_INFO,
  SET_TRACK_BOUNDS,
  SHOW_VESSEL_CLUSTER_INFO,
  SHOW_NO_VESSELS_INFO,
  TOGGLE_ACTIVE_VESSEL_PIN,
  SHOW_VESSEL_DETAILS
} from 'actions';

const initialState = {
  tracks: [],
  details: [],
  detailsStatus: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_VESSEL: {
      return Object.assign({}, state, {
        detailsStatus: { isLoading: true }
      });
    }
    case SET_VESSEL_TRACK: {
      const newTrack = {
        seriesgroup: action.payload.seriesgroup,
        data: action.payload.seriesGroupData,
        selectedSeries: action.payload.selectedSeries
      };
      return Object.assign({}, state, {
        tracks: [...state.tracks, newTrack]
      });
    }

    case SET_VESSEL_DETAILS: {
      const newDetails = Object.assign({
        pinned: false,
        visible: false
      }, action.payload);
      return Object.assign({}, state, {
        details: [...state.details, newDetails],
        detailsStatus: { isLoaded: true }
      });
    }

    case SHOW_VESSEL_DETAILS: {
      const detailsIndex = state.details.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newDetails = _.cloneDeep(state.details[detailsIndex]);
      newDetails.visible = true;

      return Object.assign({}, state, {
        details: [...state.details.slice(0, detailsIndex), newDetails, ...state.details.slice(detailsIndex + 1)],
        detailsStatus: { isLoaded: true }
      });
    }

    case CLEAR_VESSEL_INFO: {
      const detailsIndex = state.details.findIndex(vessel => vessel.visible === true);

      // no vessel currently shown: just reset details status
      if (detailsIndex === -1) {
        return Object.assign({}, state, {
          detailsStatus: null
        });
      }

      const currentlyVisibleVessel = _.cloneDeep(state.details[detailsIndex]);
      currentlyVisibleVessel.visible = false;

      // vessel is pinned: set info to visible = false
      if (currentlyVisibleVessel.pinned === true) {
        return Object.assign({}, state, {
          details: [...state.details.slice(0, detailsIndex), currentlyVisibleVessel, ...state.details.slice(detailsIndex + 1)],
          detailsStatus: null
        });
      }

      // vessel is not pinned: get rid of details + track
      const tracksIndex = state.tracks.findIndex(vessel => vessel.seriesgroup === currentlyVisibleVessel.seriesgroup);
      return Object.assign({}, state, {
        details: [...state.details.slice(0, detailsIndex), ...state.details.slice(detailsIndex + 1)],
        tracks: [...state.tracks.slice(0, tracksIndex), ...state.tracks.slice(tracksIndex + 1)],
        detailsStatus: null
      });
    }
    case SHOW_VESSEL_CLUSTER_INFO:
      return Object.assign({}, state, {
        detailsStatus: { isCluster: true }
      });
    case SHOW_NO_VESSELS_INFO:
      return Object.assign({}, state, {
        detailsStatus: { isEmpty: true }
      });
    case SET_TRACK_BOUNDS: {
      return Object.assign({}, state, { trackBounds: action.trackBounds });
    }
    case TOGGLE_ACTIVE_VESSEL_PIN: {
      const detailsIndex = state.details.findIndex(vessel => vessel.visible === true);
      const newDetails = _.cloneDeep(state.details[detailsIndex]);
      newDetails.pinned = !newDetails.pinned;

      return Object.assign({}, state, {
        details: [...state.details.slice(0, detailsIndex), newDetails, ...state.details.slice(detailsIndex + 1)]
      });
    }
    default:
      return state;
  }
}
