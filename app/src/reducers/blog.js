const initialState = {};
import { GET_RECENT_POSTS, GET_POST_BY_SLUG } from '../actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RECENT_POSTS:
      return Object.assign({}, state, { recentPost: action.payload });
    case GET_POST_BY_SLUG:
      return Object.assign({}, state, { post: action.payload });
    default:
      return state;
  }
}
