import { GET_USER, SET_TOKEN, TOKEN_SESSION, LOGOUT } from '../actions';
import 'whatwg-fetch';

const url = 'https://skytruth-pleuston.appspot.com';


export function setToken(token) {
  sessionStorage.setItem(TOKEN_SESSION, token);
  return {
    type: SET_TOKEN,
    payload: token
  };
}

export function getLoggedUser() {
  return (dispatch, getState) => {
    const state = getState();
    let token = state.user.token;
    if ((!state.user || !state.user.token) && (sessionStorage.getItem(TOKEN_SESSION))) {
      token = sessionStorage.getItem(TOKEN_SESSION);
      dispatch(setToken(token));
    }

    if (!token) {
      dispatch({
        type: GET_USER,
        payload: null
      });
    }

    fetch(`${url}/v1/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return null;
    }).then((user) => {
      dispatch({
        type: GET_USER,
        payload: user
      });
    });
  };
}

export function logout() {
  return (dispatch) => {
    sessionStorage.removeItem(TOKEN_SESSION);
    dispatch({
      type: LOGOUT
    });
  };
}

export function login() {
  window.location = `https://skytruth-pleuston.appspot.com/v1/authorize?\
response_type=token&client_id=asddafd&redirect_uri=${window.location}`;
}

export function register() {
  alert('Redirect to registration page');
}
