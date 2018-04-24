import {
  SET_HOVER_POPUP,
  SET_POPUP,
  CLEAR_POPUP,
  SET_MAP_CURSOR
} from 'map/mapInteractionActions';

const initialState = {
  hoverPopup: null,
  popup: null,
  cursor: 'progress'
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_HOVER_POPUP : {
      return { ...state, hoverPopup: action.payload };
    }
    case SET_POPUP : {
      return { ...state, popup: action.payload };
    }
    case CLEAR_POPUP : {
      return { ...state, popup: null };
    }
    case SET_MAP_CURSOR : {
      return { ...state, cursor: action.payload };
    }
    default:
      return state;
  }
}
