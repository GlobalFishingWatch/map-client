
import { GET_LAYER_LIBRARY } from 'actions';

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LAYER_LIBRARY:
      return Object.assign({}, state, { layers: action.payload });
    default:
      return state;
  }
}
