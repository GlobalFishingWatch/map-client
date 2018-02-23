import { SET_IS_EMBEDDED } from './appActions';

const initialState = {
  isEmbedded: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_IS_EMBEDDED:
      return Object.assign({}, state, { isEmbedded: action.payload });
    default:
      return state;
  }
}
