import {
  VESSEL_INIT,
  SHOW_LOADING,
  TOGGLE_LAYER_VISIBILITY,
  SET_LAYERS,
  SET_LAYER_OPACITY,
  SET_ZOOM,
  SET_CENTER,
  SHARE_MODAL_OPEN,
  SET_WORKSPACE_ID,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  UPDATE_VESSEL_TRANSPARENCY,
  UPDATE_VESSEL_COLOR,
  CHANGE_VESSEL_TRACK_DISPLAY_MODE,
  SET_BASEMAP
} from '../actions';
import _ from 'lodash';
import { DEFAULT_VESSEL_COLOR } from '../constants';

const initialState = {
  active_basemap: 'satellite',
  basemaps: [
    {
      title: 'satellite',
      type: 'GoogleBasemap'
    },
    {
      title: 'deep blue',
      type: 'CartoDBBasemap',
      url: 'https://simbiotica.carto.com/api/v2/viz/2d92092c-5afa-11e6-aa0c-0e233c30368f/viz.json'
    },
    {
      title: 'high contrast',
      type: 'CartoDBBasemap',
      url: 'https://simbiotica.carto.com/api/v2/viz/82f5ccde-6002-11e6-9f8e-0e05a8b3e3d7/viz.json'
    }
  ],
  loading: false,
  layers: [],
  zoom: 3,
  center: [0, 0],
  shareModal: {
    open: false,
    error: null
  },
  workspaceId: null,
  vesselTransparency: 5,
  vesselColor: DEFAULT_VESSEL_COLOR,
  vesselTrackDisplayMode: 'current'
};

/**
 * Map reducer
 *
 * @export Map reducer
 * @param {object} [state=initialState]
 * @param {object} action
 * @returns {object}
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case VESSEL_INIT:
      return Object.assign({}, state, action.payload);
    case SHOW_LOADING:
      return Object.assign({}, state, { loading: action.payload.data });
    case SET_LAYERS: {
      return Object.assign({}, state, { layers: action.payload });
    }
    case SET_ZOOM:
      return Object.assign({}, state, { zoom: action.payload });
    case SET_CENTER:
      return Object.assign({}, state, { center: action.payload });
    case UPDATE_VESSEL_TRANSPARENCY:
      return Object.assign({}, state, { vesselTransparency: action.payload });
    case UPDATE_VESSEL_COLOR:
      return Object.assign({}, state, { vesselColor: action.payload });
    case CHANGE_VESSEL_TRACK_DISPLAY_MODE:
      return Object.assign({}, state, { vesselTrackDisplayMode: action.payload });
    case SET_LAYER_OPACITY: {
      const layers = _.cloneDeep(state.layers);
      const toggledLayerIndex = layers.findIndex(l => l.title === action.payload.layer.title);
      const newLayer = layers[toggledLayerIndex];

      if (toggledLayerIndex === -1) return state;

      newLayer.opacity = action.payload.opacity;

      return Object.assign({}, state, { layers });
    }
    case TOGGLE_LAYER_VISIBILITY: {
      const layers = _.cloneDeep(state.layers);
      const toggledLayerIndex = layers.findIndex(l => l.title === action.payload.title);
      const newLayer = layers[toggledLayerIndex];

      if (toggledLayerIndex === -1) return state;

      newLayer.visible = !newLayer.visible;

      return Object.assign({}, state, { layers });
    }
    case SET_BASEMAP: {
      return Object.assign({}, state, { active_basemap: action.payload.title });
    }

    case SHARE_MODAL_OPEN: {
      const newState = Object.assign({}, state);
      newState.shareModal.open = action.payload;
      return newState;
    }

    case SET_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: action.payload });

    case DELETE_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: null });

    case SET_SHARE_MODAL_ERROR: {
      const newState = Object.assign({}, state);
      newState.shareModal.error = action.payload;
      return newState;
    }

    default:
      return state;
  }
}
