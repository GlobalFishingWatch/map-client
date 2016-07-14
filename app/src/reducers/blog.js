const initialState = {};
import {GET_RECENT_POST} from "../constants";

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RECENT_POST:
      return Object.assign({}, state, {recentPost: action.payload});
    default:
      return state;
  }
};
