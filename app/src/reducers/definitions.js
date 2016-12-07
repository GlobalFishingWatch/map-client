const initialState = null;
import { GET_DEFINITION_ENTRIES } from 'actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DEFINITION_ENTRIES:
      return action.payload;
    default:
      return state;
  }
}
