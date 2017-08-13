import {
  DELETE_WORKSPACE_ID,
  INIT_GOOGLE_MAPS,
  SET_CENTER,
  SET_CENTER_TILE,
  SET_DRAWING,
  SET_LAYER_INFO_MODAL,
  SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
  SET_LOADERS,
  SET_LOADING,
  SET_MOUSE_LAT_LONG,
  SET_ZOOM
} from 'actions/map';
import { MAX_ZOOM_LEVEL } from 'constants';
import { SET_MAX_ZOOM } from 'layers/layersActions';
import { SET_TILESET_ID, SET_TILESET_URL, SET_URL_WORKSPACE_ID, SET_WORKSPACE_ID } from 'actions/workspace';

const initialState = {
  isDrawing: false,
  loading: false,
  loaders: {},
  zoom: 3,
  maxZoom: MAX_ZOOM_LEVEL,
  tilesetUrl: null,
  tilesetId: null,
  center: [0, 0],
  mouseLatLong: [0, 0],
  centerTile: { x: 0, y: 0 },
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
    case SET_LOADING:
      return Object.assign({}, state, { loading: action.payload });
    case SET_DRAWING:
      return Object.assign({}, state, { isDrawing: action.payload });
    case SET_LOADERS:
      return Object.assign({}, state, { loaders: action.payload });
    case SET_URL_WORKSPACE_ID:
      return Object.assign({}, state, { urlWorkspaceId: action.payload });
    case SET_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: action.payload });
    case DELETE_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: null });

    case SET_LAYER_INFO_MODAL: {
      const newState = Object.assign({}, state);
      newState.layerModal = {
        open: action.payload.open,
        info: action.payload.info
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
    case SET_MOUSE_LAT_LONG: {
      const newState = Object.assign({}, state);
      newState.mouseLatLong = {
        lat: action.payload.lat,
        long: action.payload.long
      };

      return newState;
    }

    default:
      return state;
  }
}
