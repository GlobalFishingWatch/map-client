import { SET_VISIBLE_MENU } from '../actions';

export function setVisibleMenu(visible) {
  return {
    type: SET_VISIBLE_MENU,
    payload: visible
  };
}
