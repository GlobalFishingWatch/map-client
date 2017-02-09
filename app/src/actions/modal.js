import {
  SET_WELCOME_MODAL_URL,
  SET_WELCOME_MODAL_CONTENT,
  SET_WELCOME_MODAL_CONTENT_ERROR,
  SET_WELCOME_MODAL_VISIBILITY
} from 'actions';
import 'whatwg-fetch';

export function setWelcomeModalUrl() {
  const cookie = document.cookie.split(WELCOME_MODAL_COOKIE_KEY);
  debugger;
  if (cookie.length < 2) return { type: SET_WELCOME_MODAL_URL, payload: null };
  const url = cookie[1].split('=')[1];

  return { type: SET_WELCOME_MODAL_URL, payload: url };
}

export function setWelcomeModalContent() {
  return (dispatch, getState) => {
    const state = getState();
    const url = state.modal.welcome.url;

    fetch(url)
      .then((res) => {
        if (res.status >= 400) throw new Error(res.statusText);
        return res.text();
      })
      .then((body) => {
        dispatch({ type: SET_WELCOME_MODAL_CONTENT, payload: body });
        dispatch({ type: SET_WELCOME_MODAL_VISIBILITY, payload: true });
      })
      .catch(err => dispatch({ type: SET_WELCOME_MODAL_CONTENT_ERROR, payload: err }));
  };
}

export function setWelcomeModalVisibility(visibility) {
  return {
    type: SET_WELCOME_MODAL_VISIBILITY,
    payload: visibility
  };
}
