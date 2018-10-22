import {
  SET_HOVER_POPUP,
  SET_POPUP,
  CLEAR_POPUP,
  UPDATE_POPUP_REPORT_STATUS,
  SET_MAP_CURSOR
} from './mapInteractionActions';
import GL_STYLE from './gl-style.json';

const popupsFields = {};
Object.keys(GL_STYLE.sources).forEach((id) => {
  const metadata = GL_STYLE.sources[id].metadata;
  if (metadata !== undefined && metadata['gfw:popups'] !== undefined) {
    popupsFields[id] = metadata['gfw:popups'];
  }
});

const initialState = {
  popupsFields,
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
      return { ...state, popup: action.payload, hoverPopup: null };
    }
    case CLEAR_POPUP : {
      return { ...state, popup: null, hoverPopup: null };
    }
    case UPDATE_POPUP_REPORT_STATUS : {
      const newPopup = { ...state.popup, isInReport: action.payload };
      return { ...state, popup: newPopup };
    }
    case SET_MAP_CURSOR : {
      return { ...state, cursor: action.payload };
    }
    default:
      return state;
  }
}
