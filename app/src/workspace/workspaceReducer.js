import {
  UPDATE_WORKSPACE,
  TRANSITION_ZOOM,
  UPDATE_MOUSE_LAT_LON,
  SET_URL_WORKSPACE_ID,
  SET_WORKSPACE_ID,
  SET_WORKSPACE_OVERRIDE,
  DELETE_WORKSPACE_ID,
} from 'workspace/workspaceActions';

const initialState = {
  workspaceId: null,
  isLoaded: false,
  viewport: {},
  mouseLatLon: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_WORKSPACE:
      return { ...state, ...action.payload, isLoaded: true };
    case TRANSITION_ZOOM: {
      const offset = action.payload;
      const viewport = { ...state.viewport, zoom: state.viewport.zoom + offset };
      return { ...state, viewport };
    }
    case UPDATE_MOUSE_LAT_LON:
      return { ...state, mouseLatLon: action.payload };
    case SET_URL_WORKSPACE_ID:
      return Object.assign({}, state, { urlWorkspaceId: action.payload });
    case SET_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: action.payload });
    case DELETE_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: null });
    case SET_WORKSPACE_OVERRIDE:
      return Object.assign({}, state, { workspaceOverride: action.payload });
    default:
      return state;
  }
}
