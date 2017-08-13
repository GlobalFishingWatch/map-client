import {
  SET_WELCOME_MODAL_URL,
  SET_WELCOME_MODAL_CONTENT,
  SET_WELCOME_MODAL_CONTENT_ERROR,
  SET_WELCOME_MODAL_VISIBILITY
} from 'welcomeModal/welcomeModalActions';

const initialState = {
  url: null,
  content: null,
  error: false,
  open: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_WELCOME_MODAL_URL:
      return Object.assign({}, state, { url: action.payload });
    case SET_WELCOME_MODAL_CONTENT:
      return Object.assign({}, state, { content: action.payload });
    case SET_WELCOME_MODAL_CONTENT_ERROR:
      return Object.assign({}, state, { error: action.payload });
    case SET_WELCOME_MODAL_VISIBILITY:
      return Object.assign({}, state, { open: action.payload });
    default:
      return state;
  }
}
