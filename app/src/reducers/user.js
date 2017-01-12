import { SET_ACL, SET_USER, SET_TOKEN, LOGOUT } from 'actions';
import { GUEST_PERMISSION_SET } from 'constants';

const initialState = {
  acl: GUEST_PERMISSION_SET
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ACL:
      return Object.assign({}, state, { acl: action.payload });
    case SET_USER:
      return Object.assign({}, state, { loggedUser: action.payload });
    case SET_TOKEN:
      return Object.assign({}, state, { token: action.payload });
    case LOGOUT:
      return Object.assign({}, state, { token: null, loggedUser: null, acl: GUEST_PERMISSION_SET });
    default:
      return state;
  }
}
