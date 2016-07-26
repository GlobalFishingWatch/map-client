const initialState = {};
import {GET_USER, SET_TOKEN, LOGOUT} from "../constants";

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return Object.assign({}, state, {loggedUser: action.payload});
    case SET_TOKEN:
      return Object.assign({}, state, {token: action.payload});
    case LOGOUT:
      return Object.assign({}, state, {token: null, loggedUser: null});
    default:
      return state;
  }
};
