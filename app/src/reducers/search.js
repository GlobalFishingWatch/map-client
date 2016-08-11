const initialState = {
  entries: [],
  count: -1 // To differentiate the cases when not searched yet and search with no result
};
import { SET_SEARCH_RESULTS } from '../actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
