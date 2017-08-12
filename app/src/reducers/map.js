/* eslint-disable max-len  */
import {
  INIT_GOOGLE_MAPS,
  SET_ZOOM,
  SET_LOADING,
  SET_DRAWING,
  SET_LOADERS,
  SET_MAX_ZOOM,
  SET_CENTER,
  SHARE_MODAL_OPEN,
  SET_WORKSPACE_ID,
  SET_URL_WORKSPACE_ID,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  SET_LAYER_INFO_MODAL,
  SET_BASEMAP,
  SET_TILESET_URL,
  SET_TILESET_ID,
  SET_SUPPORT_MODAL_VISIBILITY,
  SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
  SET_RECENT_VESSELS_VISIBILITY,
  SET_CENTER_TILE,
  SET_SUBMENU
} from 'actions';
import { MAX_ZOOM_LEVEL } from 'constants';

const initialState = {
  activeBasemap: 'hybrid',
  basemaps: [
    {
      title: 'hybrid',
      label: 'Satellite',
      description: 'The default satellite image view',
      type: 'GoogleBasemap'
    },
    {
      title: 'Deep Blue',
      label: 'Deep Blue',
      description: 'Custom basemap that highlights the data about fishing activity',
      type: 'Basemap',
      url: 'https://api.mapbox.com/styles/v1/enriquetuya/cj3vr6qy802b72so7jvennfkg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW5yaXF1ZXR1eWEiLCJhIjoiY2loNmFwYjJuMDlzZnR4bHh3NnRyNmQxcCJ9.vf_v5i6RWNz5Q7rglf35pQ'
    },
    {
      title: 'High Contrast',
      label: 'High Contrast',
      description: 'High contrast basemap, that highlights borders and shore. Ideal for usage with projectors',
      type: 'Basemap',
      url: 'https://api.mapbox.com/styles/v1/enriquetuya/cj3vr7wzg02cy2rpcx1kteotc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW5yaXF1ZXR1eWEiLCJhIjoiY2loNmFwYjJuMDlzZnR4bHh3NnRyNmQxcCJ9.vf_v5i6RWNz5Q7rglf35pQ'
    }
  ],
  drawing: false,
  loading: false,
  loaders: {},
  zoom: 3,
  maxZoom: MAX_ZOOM_LEVEL,
  tilesetUrl: null,
  tilesetId: null,
  center: [0, 0],
  centerTile: { x: 0, y: 0 },
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
  recentVesselModal: {
    open: false
  },
  workspaceId: null,
  activeSubmenu: null
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
    case INIT_GOOGLE_MAPS:
      return Object.assign({}, state, { googleMaps: action.payload });
    case SET_TILESET_ID:
      return Object.assign({}, state, { tilesetId: action.payload });
    case SET_TILESET_URL:
      return Object.assign({}, state, { tilesetUrl: action.payload });
    case SET_ZOOM: {
      const newState = {
        zoom: action.payload.zoom
      };
      if (action.payload.zoomCenter !== null && action.payload.zoomCenter !== undefined) {
        newState.center = action.payload.zoomCenter;
      }
      return Object.assign({}, state, newState);
    }
    case SET_MAX_ZOOM:
      return Object.assign({}, state, { maxZoom: Math.min(action.payload, state.maxZoom) });
    case SET_CENTER:
      return Object.assign({}, state, { center: action.payload });
    case SET_CENTER_TILE:
      return Object.assign({}, state, { centerTile: action.payload });
    case SET_BASEMAP:
      return Object.assign({}, state, { activeBasemap: action.payload || state.activeBasemap });
    case SHARE_MODAL_OPEN: {
      const shareModal = Object.assign({}, state.shareModal, { open: action.payload });
      return Object.assign({}, state, { shareModal });
    }
    case SET_LOADING:
      return Object.assign({}, state, { loading: action.payload });
    case SET_DRAWING:
      return Object.assign({}, state, { drawing: action.payload });
    case SET_LOADERS:
      return Object.assign({}, state, { loaders: action.payload });
    case SET_URL_WORKSPACE_ID:
      return Object.assign({}, state, { urlWorkspaceId: action.payload });
    case SET_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: action.payload });
    case SET_SUBMENU:
      return Object.assign({}, state, { activeSubmenu: action.payload });

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

    case SET_RECENT_VESSELS_VISIBILITY: {
      const newState = Object.assign({}, state);
      newState.recentVesselModal = {
        open: action.payload
      };

      return newState;
    }

    default:
      return state;
  }
}
