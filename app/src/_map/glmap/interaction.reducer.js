// TODO MAP MODULE remove whole reducer
import {
  SET_MAP_CURSOR
} from './interaction.actions';

const initialState = {
  cursor: 'progress'
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_MAP_CURSOR : {
      return { ...state, cursor: action.payload };
    }
    default:
      return state;
  }
}
