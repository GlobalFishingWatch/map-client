const initialState = { menuVisible: false, supportModalVisible: false };
import { SET_VISIBLE_MENU } from '../actions';

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VISIBLE_MENU:
      return Object.assign({}, state, { menuVisible: action.payload });
    default:
      return state;
  }
}
