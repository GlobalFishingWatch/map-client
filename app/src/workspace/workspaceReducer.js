import {
  UPDATE_WORKSPACE,
  TRANSITION_ZOOM,
  SET_URL_WORKSPACE_ID,
  SET_WORKSPACE_ID,
  SET_WORKSPACE_OVERRIDE,
  DELETE_WORKSPACE_ID,
  SET_LEGACY_WORKSPACE_LOADED
} from 'workspace/workspaceActions';

const initialState = {
  workspaceId: null,
  isLoaded: false,
  legacyWorkspaceLoaded: false,
  viewport: {}
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
    case SET_URL_WORKSPACE_ID:
      return Object.assign({}, state, { urlWorkspaceId: action.payload });
    case SET_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: action.payload });
    case DELETE_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: null });
    case SET_WORKSPACE_OVERRIDE:
      return Object.assign({}, state, { workspaceOverride: action.payload });
    case SET_LEGACY_WORKSPACE_LOADED:
      return Object.assign({}, state, { legacyWorkspaceLoaded: true });
    default:
      return state;
  }
}
