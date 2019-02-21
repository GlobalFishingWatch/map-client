import find from 'lodash/find';
import getVesselName from 'utils/getVesselName';
import { PALETTE_COLORS, DEFAULT_TRACK_PALETTE_INDEX } from 'config';
import { INFO_STATUS } from 'constants';
import {
  SET_VESSEL_DETAILS,
  ADD_VESSEL,
  LOAD_PINNED_VESSEL,
  SHOW_VESSEL_DETAILS,
  CLEAR_VESSEL_INFO,
  HIDE_VESSELS_INFO_PANEL,
  TOGGLE_VESSEL_PIN,
  SET_PINNED_VESSEL_COLOR,
  SET_PINNED_VESSEL_TRACK_VISIBILITY,
  SET_PINNED_VESSEL_TITLE,
  TOGGLE_PINNED_VESSEL_EDIT_MODE,
  HIGHLIGHT_TRACK
} from 'vesselInfo/vesselInfoActions';

const initialState = {
  vessels: [],
  infoPanelStatus: INFO_STATUS.HIDDEN,
  pinnedVesselEditMode: false,
  currentlyShownVessel: null,
  currentPaletteIndex: DEFAULT_TRACK_PALETTE_INDEX,
  highlightedTrack: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_VESSEL: {
      if (find(state.vessels, l => l.seriesgroup === action.payload.seriesgroup && l.tilesetId === action.payload.tilesetId)) {
        return state;
      }

      const color = PALETTE_COLORS[state.currentPaletteIndex].color;

      const newVessel = {
        seriesgroup: action.payload.seriesgroup,
        tilesetId: action.payload.tilesetId,
        parentEncounter: action.payload.parentEncounter,
        comment: action.payload.comment,
        visible: action.payload.visible || false,
        pinned: false,
        shownInInfoPanel: false,
        color
      };
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.LOADING,
        vessels: [...state.vessels, newVessel]
      });
    }

    case SET_VESSEL_DETAILS: {
      const vesselData = action.payload.vesselData;
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === vesselData.seriesgroup);
      const currentVessel = state.vessels[vesselIndex];

      const defaultTitle = getVesselName(vesselData, action.payload.layer.header.info.fields);

      const newVessel = Object.assign({
        defaultTitle,
        title: defaultTitle
      }, currentVessel, vesselData);

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)],
        infoPanelStatus: INFO_STATUS.LOADED
      });
    }

    case LOAD_PINNED_VESSEL: {
      const vesselIndex = state.vessels
        .findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup && vessel.tilesetId === action.payload.tilesetId);
      if (vesselIndex > -1) {
        const newVessel = Object.assign(state.vessels[vesselIndex], {
          color: action.payload.color,
          pinned: true,
          visible: action.payload.visible
        });

        let currentlyShownVessel = state.currentlyShownVessel;
        if (newVessel.seriesgroup === currentlyShownVessel.seriesgroup && newVessel.tilesetId === currentlyShownVessel.tilesetId) {
          currentlyShownVessel = Object.assign({}, currentlyShownVessel);
          currentlyShownVessel.pinned = true;
        }

        return Object.assign({}, state, {
          vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)],
          currentlyShownVessel
        });
      }

      const newVessel = Object.assign({
        visible: false,
        shownInInfoPanel: false,
        pinned: true,
        title: action.payload.title || action.payload.vesselname,
        color: action.payload.color
      }, action.payload);

      return Object.assign({}, state, {
        vessels: [...state.vessels, newVessel]
      });
    }

    case SHOW_VESSEL_DETAILS: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const currentlyShownVessel = Object.assign({}, state.vessels[vesselIndex]);
      currentlyShownVessel.shownInInfoPanel = true;
      // currentlyShownVessel.hasTrack = currentlyShownVessel.track !== undefined;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), currentlyShownVessel, ...state.vessels.slice(vesselIndex + 1)],
        infoPanelStatus: INFO_STATUS.LOADED,
        currentlyShownVessel
      });
    }

    case CLEAR_VESSEL_INFO: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.shownInInfoPanel === true);

      // no vessel currently shown: just reset infoPanelStatus
      if (vesselIndex === -1) {
        return Object.assign({}, state, {
          infoPanelStatus: INFO_STATUS.HIDDEN,
          currentlyShownVessel: null
        });
      }

      let currentlyShownVessel = state.vessels[vesselIndex];

      // vessel is pinned: set info to shownInInfoPanel = false
      if (currentlyShownVessel.pinned === true) {
        currentlyShownVessel = Object.assign({}, currentlyShownVessel);
        currentlyShownVessel.shownInInfoPanel = false;
        return Object.assign({}, state, {
          vessels: [...state.vessels.slice(0, vesselIndex), currentlyShownVessel, ...state.vessels.slice(vesselIndex + 1)],
          infoPanelStatus: INFO_STATUS.LOADED,
          currentlyShownVessel: null
        });
      }

      // vessel is not pinned: get rid of vessel
      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), ...state.vessels.slice(vesselIndex + 1)],
        infoPanelStatus: INFO_STATUS.HIDDEN,
        currentlyShownVessel: null
      });
    }

    case HIDE_VESSELS_INFO_PANEL:
      return Object.assign({}, state, {
        detailsStatus: null
      });
    case TOGGLE_VESSEL_PIN: {
      const vesselIndex = action.payload.vesselIndex;
      const newVessel = Object.assign({}, state.vessels[vesselIndex]);
      newVessel.pinned = action.payload.pinned;
      newVessel.visible = action.payload.visible;

      let currentlyShownVessel = state.currentlyShownVessel;
      if (
        state.currentlyShownVessel &&
        newVessel.seriesgroup === state.currentlyShownVessel.seriesgroup &&
        newVessel.tilesetId === state.currentlyShownVessel.tilesetId
      ) {
        currentlyShownVessel = Object.assign({}, state.currentlyShownVessel);
        currentlyShownVessel.pinned = action.payload.pinned;
      }

      let currentPaletteIndex = state.currentPaletteIndex;
      if (action.payload.pinned === true) {
        currentPaletteIndex = (state.currentPaletteIndex === PALETTE_COLORS.length - 1) ? 0 : state.currentPaletteIndex + 1;
      }


      const newVessels = [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)];
      return Object.assign({}, state, {
        vessels: newVessels,
        pinnedVesselEditMode: state.pinnedVesselEditMode && newVessels.filter(e => e.pinned === true).length > 0,
        currentlyShownVessel,
        currentPaletteIndex
      });
    }
    case SET_PINNED_VESSEL_COLOR: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = Object.assign({}, state.vessels[vesselIndex]);
      newVessel.color = action.payload.color;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)]
      });
    }
    case SET_PINNED_VESSEL_TRACK_VISIBILITY: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = Object.assign({}, state.vessels[vesselIndex]);
      newVessel.visible = action.payload.visible;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)]
      });
    }
    case SET_PINNED_VESSEL_TITLE: {
      const vesselIndex = state.vessels.findIndex(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      const newVessel = Object.assign({}, state.vessels[vesselIndex]);
      newVessel.title = action.payload.title;

      return Object.assign({}, state, {
        vessels: [...state.vessels.slice(0, vesselIndex), newVessel, ...state.vessels.slice(vesselIndex + 1)]
      });
    }

    case TOGGLE_PINNED_VESSEL_EDIT_MODE: {
      const newState = Object.assign({}, state, {
        pinnedVesselEditMode: action.payload.forceMode === null ? !state.pinnedVesselEditMode : action.payload.forceMode
      });

      if (newState.pinnedVesselEditMode === false) {
        newState.vessels = Object.assign({}, state.vessels);

        newState.vessels.forEach((vesselDetail) => {
          if (vesselDetail.title.trim() === '') {
            vesselDetail.title = vesselDetail.defaultTitle;
          }
        });
      }

      return newState;
    }

    case HIGHLIGHT_TRACK: {
      return { ...state, highlightedTrack: action.payload };
    }

    default:
      return state;
  }
}
