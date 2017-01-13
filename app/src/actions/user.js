import { SET_USER_PERMISSIONS, SET_USER, SET_TOKEN, TOKEN_SESSION, LOGOUT } from 'actions';
import { AUTH_PERMISSION_SET, GUEST_PERMISSION_SET } from 'constants';
import 'whatwg-fetch';
import { browserHistory } from 'react-router';
import _ from 'lodash';

export function setToken(token) {
  localStorage.setItem(TOKEN_SESSION, token);
  return {
    type: SET_TOKEN,
    payload: token
  };
}

function getUserData(data) {
  return {
    displayName: data.displayName,
    email: data.email
  };
}

function getAclData(data) {
  return data.allowedFeatures;
}

export function getLoggedUser() {
  return (dispatch, getState) => {
    const state = getState();
    let token = state.user.token;
    if ((!state.user || !state.user.token) && (localStorage.getItem(TOKEN_SESSION))) {
      token = localStorage.getItem(TOKEN_SESSION);
      dispatch(setToken(token));
    }

    if (!token) {
      dispatch({
        type: SET_USER,
        payload: null
      });
      dispatch({
        type: SET_USER_PERMISSIONS,
        payload: getAclData(GUEST_PERMISSION_SET)
      });
      return;
    }

    fetch(`${MAP_API_ENDPOINT}/v1/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      dispatch({
        type: SET_TOKEN,
        payload: null
      });
      return null;
    }).then((payload) => {
      dispatch({
        type: SET_USER,
        payload: getUserData(payload)
      });
      dispatch({
        type: SET_USER_PERMISSIONS,
        payload: _.uniq(AUTH_PERMISSION_SET.concat(getAclData(payload)))
      });
    });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem(TOKEN_SESSION);
    dispatch({
      type: LOGOUT
    });
    window.location.hash = window.location.hash.replace(/#access_token=([a-zA-Z0-9.\-_]*)/g, '');
    if (window.location.pathname.match('^/map')) {
      browserHistory.push('/');
    }
  };
}

export function login() {
  window.location = `${MAP_API_ENDPOINT}/v1/authorize?\
response_type=token&client_id=asddafd&redirect_uri=${window.location}`;
}
