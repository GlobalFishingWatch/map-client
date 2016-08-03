const initialState = {};
import {GET_RECENT_POST, GET_POST_BY_ID} from "../constants";

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RECENT_POST:
      return Object.assign({}, state, {recentPost: action.payload});
    case GET_POST_BY_ID:
      return Object.assign({}, state, {post: action.payload});
    default:
      return state;
  }
};
