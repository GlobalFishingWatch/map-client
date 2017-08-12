import { LOAD_LITERALS } from 'actions';

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_LITERALS:
      return action.payload;
    default:
      return state;
  }
}
