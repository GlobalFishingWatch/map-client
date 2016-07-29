import {SET_VISIBLE_MENU} from "../constants";

export function setVisibleMenu(visible) {
      return {
        type: SET_VISIBLE_MENU,
        payload: visible
      };
};
