const initialState = null;
import { FORM_RESPONSE } from '../actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case FORM_RESPONSE:
      return action.payload;
    default:
      return state;
  }
}
