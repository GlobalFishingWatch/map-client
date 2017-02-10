import {
  SET_WELCOME_MODAL_URL,
  SET_WELCOME_MODAL_CONTENT,
  SET_WELCOME_MODAL_CONTENT_ERROR,
  SET_WELCOME_MODAL_VISIBILITY
} from 'actions';

/**
 * TODO: refactor all modals living in the ./reducers/map.js file to this one.
 */

const initialState = {
  welcome: {
    url: null,
    content: null,
    error: false,
    open: false
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_WELCOME_MODAL_URL: {
      const welcome = Object.assign({}, state.welcome, { url: action.payload });
      return Object.assign({}, state, { welcome });
    }
    case SET_WELCOME_MODAL_CONTENT: {
      const welcome = Object.assign({}, state.welcome, { content: action.payload });
      return Object.assign({}, state, { welcome });
    }
    case SET_WELCOME_MODAL_CONTENT_ERROR: {
      const welcome = Object.assign({}, state.welcome, { error: action.payload });
      return Object.assign({}, state, { welcome });
    }
    case SET_WELCOME_MODAL_VISIBILITY: {
      const welcome = Object.assign({}, state.welcome, { open: action.payload });
      return Object.assign({}, state, { welcome });
    }
    default:
      return state;
  }
}
