const initialState = {
  entries: [],
  count: 0
};
import { GET_SEARCH_RESULTS } from '../constants';

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SEARCH_RESULTS:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
