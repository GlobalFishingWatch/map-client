import {
  SET_URL_WORKSPACE_ID,
  SET_WORKSPACE_ID,
  SET_WORKSPACE_OVERRIDE,
  DELETE_WORKSPACE_ID,
  SET_WORKSPACE_LOADED,
  SET_LEGACY_WORKSPACE_LOADED
} from 'workspace/workspaceActions';

const initialState = {
  workspaceId: null,
  workspaceLoaded: false,
  legacyWorkspaceLoaded: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_URL_WORKSPACE_ID:
      return Object.assign({}, state, { urlWorkspaceId: action.payload });
    case SET_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: action.payload });
    case DELETE_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: null });
    case SET_WORKSPACE_OVERRIDE:
      return Object.assign({}, state, { workspaceOverride: action.payload });
    case SET_WORKSPACE_LOADED:
      return Object.assign({}, state, { workspaceLoaded: true });
    case SET_LEGACY_WORKSPACE_LOADED:
      return Object.assign({}, state, { legacyWorkspaceLoaded: true });
    default:
      return state;
  }
}
