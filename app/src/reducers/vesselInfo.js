import _ from 'lodash';
import {
  ADD_VESSEL,
  SET_VESSEL_DETAILS,
  SET_VESSEL_TRACK,
  CLEAR_VESSEL_INFO,
  SET_TRACK_BOUNDS,
  SHOW_VESSEL_CLUSTER_INFO,
  SHOW_NO_VESSELS_INFO,
  TOGGLE_VESSEL_PIN,
  SHOW_VESSEL_DETAILS,
  SET_PINNED_VESSEL_HUE,
  LOAD_PINNED_VESSEL,
  SET_PINNED_VESSEL_TITLE,
  TOGGLE_PINNED_VESSEL_EDIT_MODE
} from 'actions';
import { DEFAULT_TRACK_HUE } from 'constants';

const initialState = {
  tracks: [],
  details: [],
  detailsStatus: null,
  pinnedVesselEditMode: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_PINNED_VESSEL_EDIT_MODE: {
      const newState = Object.assign({}, state, {
        pinnedVesselEditMode: action.payload.forceMode === null ? !state.pinnedVesselEditMode : action.payload.forceMode
      });

      if (newState.pinnedVesselEditMode === false) {
        newState.details = _.cloneDeep(state.details);


        newState.details.forEach((vesselDetail) => {
          if (!vesselDetail.title || /^\s*$/.test(vesselDetail.title)) {
            vesselDetail.title = vesselDetail.vesselname;
          }
        });
      }

      return newState;
    }
    case ADD_VESSEL: {
      return Object.assign({}, state, {
        detailsStatus: { isLoading: true }
      });
    }
    case SET_VESSEL_TRACK: {
      const newTrack = {
        seriesgroup: action.payload.seriesgroup,
        data: action.payload.seriesGroupData,
        selectedSeries: action.payload.selectedSeries,
        hue: DEFAULT_TRACK_HUE
      };
      return Object.assign({}, state, {
        tracks: [...state.tracks, newTrack]
      });
    }

    case SET_VESSEL_DETAILS: {
      const newDetails = Object.assign({
        pinned: false,
        visible: false,
        title: action.payload.vesselname
      }, action.payload);

      return Object.assign({}, state, {
        details: [...state.details, newDetails],
        detailsStatus: { isLoaded: true }
      });
    }

    case LOAD_PINNED_VESSEL: {
      const newDetails = Object.assign({
        pinned: true,
        visible: false,
        title: action.payload.title || action.payload.vesselname
      }, action.payload);

      return Object.assign({}, state, {
        details: [...state.details, newDetails]
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
    case TOGGLE_VESSEL_PIN: {
      let detailsIndex;
      if (action.payload.useCurrentlyVisibleVessel === true) {
        detailsIndex = state.details.findIndex(vessel => vessel.visible === true);
      } else {
        // look for vessel with given seriesgoup if provided
        detailsIndex = state.details.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      }
      const newDetail = _.cloneDeep(state.details[detailsIndex]);
      newDetail.pinned = !newDetail.pinned;

      const newDetails = [...state.details.slice(0, detailsIndex), newDetail, ...state.details.slice(detailsIndex + 1)];
      return Object.assign({}, state, {
        details: newDetails,
        pinnedVesselEditMode: state.pinnedVesselEditMode && newDetails.filter(e => e.pinned === true).length > 0
      });
    }
    case SET_PINNED_VESSEL_HUE: {
      const tracksIndex = state.tracks.findIndex(track => track.seriesgroup === action.payload.seriesgroup);
      const newTrack = _.cloneDeep(state.tracks[tracksIndex]);
      newTrack.hue = action.payload.hue;

      return Object.assign({}, state, {
        tracks: [...state.tracks.slice(0, tracksIndex), newTrack, ...state.tracks.slice(tracksIndex + 1)]
      });
    }
    case SET_PINNED_VESSEL_TITLE: {
      const detailsIndex = state.details.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newDetails = _.cloneDeep(state.details[detailsIndex]);
      newDetails.title = action.payload.title;

      return Object.assign({}, state, {
        details: [...state.details.slice(0, detailsIndex), newDetails, ...state.details.slice(detailsIndex + 1)]
      });
    }
    default:
      return state;
  }
}
