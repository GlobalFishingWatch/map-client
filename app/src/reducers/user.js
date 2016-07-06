const initialState = {

};
import {GET_USER, SET_TOKEN} from '../constants';

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return Object.assign({}, state, {loggedUser: action.payload});
    case SET_TOKEN:
      return Object.assign({}, state, {token: action.payload});
    default:
      return state;
  }
};
