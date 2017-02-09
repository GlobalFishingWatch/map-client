/* eslint-disable max-len  */
import {
  SET_WELCOME_MODAL_URL,
  SET_WELCOME_MODAL_CONTENT,
  SET_WELCOME_MODAL_CONTENT_ERROR,
  SET_WELCOME_MODAL_VISIBILITY
} from 'actions';
import 'whatwg-fetch';

export function setWelcomeModalUrl() {
  // const cookie = document.cookie.split(WELCOME_MODAL_COOKIE_KEY);
  // if (cookie.length < 2) return { type: SET_WELCOME_MODAL_URL, payload: null };
  const url = 'https://gist.githubusercontent.com/sorodrigo/c39d7718049a9b5553b5c4597f93bbdd/raw/4a7279c0e378946ec668b07fd8dbbbc41783de88/helloworld.html'; // cookie[1].split('=')[1];
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
