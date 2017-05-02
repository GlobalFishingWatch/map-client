import {
  SET_USER_PERMISSIONS, SET_USER, SET_TOKEN, TOKEN_SESSION, LOGOUT
} from 'actions';
import { AUTH_PERMISSION_SET, GUEST_PERMISSION_SET } from 'constants';
import 'whatwg-fetch';
import _ from 'lodash';

const setGAUserDimension = (user) => {
  if (user !== false) {
    window.ga('set', 'dimension1', user.identity.userId);
  } else {
    window.ga('set', 'dimension1', '');
  }
};

export function setToken(token) {
  localStorage.setItem(TOKEN_SESSION, token);
  return {
    type: SET_TOKEN,
    payload: token
  };
}

function getUserData(data) {
  if (data === undefined || data === null || data.displayName === undefined || data.email === undefined) {
    return null;
  }

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

    let headers = {};
    let basePermissions;
    if (!token) {
      basePermissions = GUEST_PERMISSION_SET;
    } else {
      basePermissions = AUTH_PERMISSION_SET;
      headers = {
        Authorization: `Bearer ${token}`
      };
    }

    fetch(`${V2_API_ENDPOINT}/me`, {
      method: 'GET',
      headers
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      dispatch({
        type: SET_TOKEN,
        payload: null
      });
      setGAUserDimension(false);
      return null;
    }).then((payload) => {
      if (payload && payload.identity) {
        setGAUserDimension(payload);
      } else {
        setGAUserDimension(false);
      }
      dispatch({
        type: SET_USER,
        payload: getUserData(payload)
      });
      dispatch({
        type: SET_USER_PERMISSIONS,
        payload: _.uniq(basePermissions.concat(getAclData(payload)))
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
    setGAUserDimension(false);
    window.location.hash = window.location.hash.replace(/#access_token=([a-zA-Z0-9.\-_]*)/g, '');
    if (window.location.pathname.match('^/map')) {
      history.pushState({}, '', '/');
    }
  };
}

export function login() {
  window.location = `${V2_API_ENDPOINT}/authorize?\
response_type=token&client_id=asddafd&redirect_uri=${window.location}`;
}
