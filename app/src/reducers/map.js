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
  SET_ZOOM
} from 'actions/map';

import {
  SET_TILESET_ID,
  SET_TILESET_URL,
  SET_URL_WORKSPACE_ID,
  SET_WORKSPACE_ID,
  SET_WORKSPACE_OVERRIDE
} from 'workspace/workspaceActions';

const initialState = {
  isDrawing: false,
  loading: false,
  loaders: {},
  tilesetUrl: null,
  tilesetId: null,
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
    case SET_WORKSPACE_OVERRIDE:
      return Object.assign({}, state, { workspaceOverride: action.payload });


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
    default:
      return state;
  }
}
