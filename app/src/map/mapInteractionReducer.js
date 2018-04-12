import {
  SET_HOVER_POPUP,
  SET_CLICK_POPUP
} from 'map/mapInteractionActions';

const initialState = {
  hoverPopup: null,
  clickPopup: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_HOVER_POPUP : {
      return { ...state, hoverPopup: action.payload };
    }
    case SET_CLICK_POPUP : {
      return { ...state };
    }
    default:
      return state;
  }
}
