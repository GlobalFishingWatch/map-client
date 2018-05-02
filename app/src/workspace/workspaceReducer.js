import {
  SET_URL_WORKSPACE_ID,
  SET_WORKSPACE_ID,
  SET_WORKSPACE_OVERRIDE,
  DELETE_WORKSPACE_ID
} from 'workspace/workspaceActions';

const initialState = {
  workspaceId: null
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
    default:
      return state;
  }
}
