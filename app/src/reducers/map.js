import {
  VESSEL_INIT,
  SHOW_LOADING,
  TOGGLE_LAYER_VISIBILITY,
  SET_LAYERS,
  SET_ZOOM,
  SET_CENTER,
  SHARE_MODAL_OPEN,
  SET_WORKSPACE_ID,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  UPDATE_VESSEL_TRANSPARENCY,
  CHANGE_VESSEL_TRACK_DISPLAY_MODE
} from '../constants';

const initialState = {
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
    case SET_ZOOM:
      return Object.assign({}, state, { zoom: action.payload });
    case SET_CENTER:
      return Object.assign({}, state, { center: action.payload });
    case UPDATE_VESSEL_TRANSPARENCY:
      return Object.assign({}, state, { vesselTransparency: action.payload });
    case CHANGE_VESSEL_TRACK_DISPLAY_MODE:
      return Object.assign({}, state, { vesselTrackDisplayMode: action.payload });
    case TOGGLE_LAYER_VISIBILITY: {
      const layers = state.layers.slice(0);
      for (let i = 0, length = layers.length; i < length; i++) {
        if (layers[i].title === action.payload.title) {
          layers[i].visible = !action.payload.visible;
          break;
        }
      }
      return Object.assign({}, state, { layers });
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
