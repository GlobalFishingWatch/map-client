/* eslint-disable max-len  */

import {
  VESSEL_INIT,
  SHOW_LOADING,
  SET_ZOOM,
  SET_MAX_ZOOM,
  SET_CENTER,
  SHARE_MODAL_OPEN,
  SET_WORKSPACE_ID,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  SET_LAYER_INFO_MODAL,
  SET_BASEMAP,
  SET_TILESET_URL,
  SET_VESSEL_CLUSTER_CENTER,
  SET_SUPPORT_MODAL_VISIBILITY,
  SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
  SET_SEARCH_EDIT_MODE
} from 'actions';
import { MAX_ZOOM_LEVEL } from 'constants';

const initialState = {
  activeBasemap: 'satellite',
  basemaps: [
    {
      title: 'satellite',
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
  zoom: 3,
  maxZoom: MAX_ZOOM_LEVEL,
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
  supportModal: {
    open: false
  },
  layerManagementModal: {
    open: false
  },
  searchEditMode: {
    open: false
  },
  workspaceId: null
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
    case SET_TILESET_URL:
      return Object.assign({}, state, { tilesetUrl: action.payload });
    case SET_ZOOM:
      return Object.assign({}, state, { zoom: action.payload });
    case SET_MAX_ZOOM:
      return Object.assign({}, state, { maxZoom: Math.min(action.payload, state.maxZoom) });
    case SET_CENTER:
      return Object.assign({}, state, { center: action.payload });
    case SET_BASEMAP:
      return Object.assign({}, state, { activeBasemap: action.payload || state.activeBasemap });
    case SHARE_MODAL_OPEN: {
      const shareModal = Object.assign({}, state.shareModal, { open: action.payload });
      return Object.assign({}, state, { shareModal });
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
    case SET_SUPPORT_MODAL_VISIBILITY: {
      const newState = Object.assign({}, state);
      newState.supportModal = {
        open: action.payload
      };
      return newState;
    }

    case SET_LAYER_MANAGEMENT_MODAL_VISIBILITY: {
      const newState = Object.assign({}, state);
      newState.layerManagementModal = {
        open: action.payload
      };

      return newState;
    }
    case SET_SEARCH_EDIT_MODE: {
      const newState = Object.assign({}, state);
      newState.searchEditMode = {
        open: action.payload
      };

      return newState;
    }

    default:
      return state;
  }
}
