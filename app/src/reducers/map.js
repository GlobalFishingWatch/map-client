/* eslint-disable max-len  */

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
  SET_LAYER_INFO_MODAL,
  UPDATE_VESSEL_TRANSPARENCY,
  UPDATE_VESSEL_COLOR,
  CHANGE_VESSEL_TRACK_DISPLAY_MODE,
  SET_BASEMAP,
  SET_TILESET_URL,
  SET_VESSEL_CLUSTER_CENTER
} from 'actions';
import _ from 'lodash';
import { DEFAULT_VESSEL_COLOR } from 'constants';

const initialState = {
  active_basemap: 'Satellite',
  basemaps: [
    {
      title: 'Satellite',
      description: 'The default satellite image view',
      type: 'GoogleBasemap'
    },
    {
      title: 'Deep Blue',
      description: 'Custom basemap that highlights the data about fishing activity',
      type: 'Basemap',
      url: 'https://api.mapbox.com/styles/v1/globalfishing/civmm3zwz00rp2jqls9pue7cw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvYmFsZmlzaGluZyIsImEiOiJjaXZtbHNlM2YwMGIxMnVxa2VwamZ5MHpwIn0.PucgGhXlmxEMryOGR7f1yw'
    },
    {
      title: 'High Contrast',
      description: 'High contrast basemap, that highlights borders and shore. Ideal for usage with projectors',
      type: 'Basemap',
      url: 'https://api.mapbox.com/styles/v1/globalfishing/civmoj3y900r92io7gqgcdppq/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2xvYmFsZmlzaGluZyIsImEiOiJjaXZtbHNlM2YwMGIxMnVxa2VwamZ5MHpwIn0.PucgGhXlmxEMryOGR7f1yw'
    }
  ],
  loading: false,
  layers: [],
  zoom: 3,
  tilesetUrl: null,
  center: [0, 0],
  shareModal: {
    open: false,
    error: null
  },
  layerModal: {
    open: false,
    info: {}
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
    case SET_LAYERS:
      return Object.assign({}, state, { layers: action.payload });
    case SET_TILESET_URL:
      return Object.assign({}, state, { tilesetUrl: action.payload });
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
    case SET_LAYER_INFO_MODAL: {
      const newState = Object.assign({}, state);
      newState.layerModal = {
        open: action.payload.open,
        info: action.payload.info
      };
      return newState;
    }
    case SET_VESSEL_CLUSTER_CENTER:
      return Object.assign({}, state, { vesselClusterCenter: [action.payload.lat(), action.payload.lng()] });
    default:
      return state;
  }
}
