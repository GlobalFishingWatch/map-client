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
  TOGGLE_PINNED_VESSEL_EDIT_MODE,
  SET_RECENT_VESSEL_HISTORY,
  LOAD_RECENT_VESSEL_HISTORY,
  SET_PINNED_VESSEL_TRACK_VISIBILITY
} from 'actions';
import { DEFAULT_TRACK_HUE } from 'constants';

const initialState = {
  vessels: [],
  infoPanelStatus: null,
  pinnedVesselEditMode: false,
  history: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_VESSEL: {
      const newVessel = {
        seriesgroup: action.payload.seriesgroup,
        visible: false,
        pinned: false,
        shownInInfoPanel: false,
        hue: DEFAULT_TRACK_HUE
      };
      return Object.assign({}, state, {
        infoPanelStatus: { isLoading: true },
        vessels: [...state.vessels, newVessel]
      });
    }

    case SET_VESSEL_DETAILS: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const currentVessel = state.vessels[vesselIndex];
      const newVessel = Object.assign({
        title: action.payload.vesselname
      }, currentVessel, action.payload);
      console.warn(newVessel);

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)],
        infoPanelStatus: { isLoaded: true }
      });
    }

    case SET_VESSEL_TRACK: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = _.cloneDeep(state.vessels[vesselIndex]);
      newVessel.track = {
        data: action.payload.seriesGroupData,
        selectedSeries: action.payload.selectedSeries
      };

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)]
      });
    }

    case LOAD_PINNED_VESSEL: {
      const newVessel = Object.assign({
        visible: false,
        shownInInfoPanel: false,
        pinned: true,
        title: action.payload.title || action.payload.vesselname,
        hue: action.payload.hue || DEFAULT_TRACK_HUE
      }, action.payload);

      return Object.assign({}, state, {
        vessels: [...state.vessels, newVessel]
      });
    }

    case SHOW_VESSEL_DETAILS: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = state.vessels[vesselIndex];
      newVessel.shownInInfoPanel = true;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)],
        infoPanelStatus: { isLoaded: true }
      });
    }

    case CLEAR_VESSEL_INFO: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.shownInInfoPanel === true);

      // no vessel currently shown: just reset infoPanelStatus
      if (vesselIndex === -1) {
        return Object.assign({}, state, {
          infoPanelStatus: null
        });
      }

      const currentlyVisibleVessel = state.vessels[vesselIndex];

      // vessel is pinned: set info to shownInInfoPanel = false
      if (currentlyVisibleVessel.pinned === true) {
        currentlyVisibleVessel.shownInInfoPanel = false;
        return Object.assign({}, state, {
          vessels: [...state.vessels.slice(0, vesselIndex), currentlyVisibleVessel, ...state.vessels.slice(vesselIndex + 1)],
          infoPanelStatus: null
        });
      }

      // vessel is not pinned: get rid of vessel
      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), ...state.vessels.slice(vesselIndex + 1)],
        infoPanelStatus: null
      });
    }
    case SHOW_VESSEL_CLUSTER_INFO:
      return Object.assign({}, state, {
        infoPanelStatus: { isCluster: true }
      });
    case SHOW_NO_VESSELS_INFO:
      return Object.assign({}, state, {
        infoPanelStatus: { isEmpty: true }
      });
    case SET_TRACK_BOUNDS: {
      return Object.assign({}, state, { trackBounds: action.trackBounds });
    }
    case TOGGLE_VESSEL_PIN: {
      let vesselIndex;
      if (action.payload.useCurrentlyVisibleVessel === true) {
        vesselIndex = state.vessels.findIndex(vessel => vessel.visible === true);
      } else {
        // look for vessel with given seriesgoup if provided
        vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      }
      const newVessel = state.vessels[vesselIndex];
      newVessel.pinned = !newVessel.pinned;

      const newVessels = [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)];
      return Object.assign({}, state, {
        vessels: newVessels,
        pinnedVesselEditMode: state.pinnedVesselEditMode && newVessels.filter(e => e.pinned === true).length > 0
      });
    }
    case SET_PINNED_VESSEL_HUE: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = state.vessels[vesselIndex];
      newVessel.hue = action.payload.hue;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)]
      });
    }
    case SET_PINNED_VESSEL_TRACK_VISIBILITY: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = state.vessels[vesselIndex];
      newVessel.visible = action.payload.visible;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)]
      });
    }
    case SET_PINNED_VESSEL_TITLE: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = state.vessels[vesselIndex];
      newVessel.title = action.payload.title;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)]
      });
    }

    case SET_RECENT_VESSEL_HISTORY: {
      const newVessel = {};
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const currentVessel = state.vessels[vesselIndex];
      let vesselHistoryIndex = -1;
      let vesselHistory = {};

      if (state.history.length > 0) {
        vesselHistoryIndex = state.history.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
        vesselHistory = state.history[vesselHistoryIndex];
      }

      Object.assign(newVessel, vesselHistory, {
        mmsi: currentVessel.mmsi,
        seriesgroup: currentVessel.seriesgroup,
        vesselname: currentVessel.vesselname,
        pinned: currentVessel.pinned,
        layerId: currentVessel.layerId
      });

      if (vesselHistoryIndex !== -1) {
        return Object.assign({}, state, {
          history: [...state.history.slice(0, vesselHistoryIndex), newVessel, ...state.history.slice(vesselHistoryIndex + 1)]
        });
      }

      try {
        const serializedState = JSON.stringify([newVessel, ...state.history]);
        localStorage.setItem('vessel_history', serializedState);
      } catch (err) {
        return Object.assign({}, state, {
          history: [newVessel, ...state.history]
        });
      }

      return Object.assign({}, state, {
        history: [newVessel, ...state.history]
      });
    }

    case LOAD_RECENT_VESSEL_HISTORY: {
      try {
        const serializedState = localStorage.getItem('vessel_history');

        if (serializedState === null) {
          return state;
        }

        return Object.assign({}, state, {
          history: JSON.parse(serializedState)
        });
      } catch (err) {
        return state;
      }
    }

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

    default:
      return state;
  }
}
