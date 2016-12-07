const initialState = null;
import { GET_ARTICLES_PUBLICATIONS_ENTRIES } from 'actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ARTICLES_PUBLICATIONS_ENTRIES:
      return action.payload;
    default:
      return state;
  }
}
