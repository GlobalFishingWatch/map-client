import {
  SET_USER_PERMISSIONS, SET_USER, SET_TOKEN, TOKEN_SESSION, LOGOUT
} from 'actions';
import { AUTH_PERMISSION_SET, GUEST_PERMISSION_SET } from 'constants';
import 'whatwg-fetch';
import _ from 'lodash';


const setGAUserDimension = (user) => {
  if (user !== false) {
    window.ga('set', 'dimension1', user.identity.userId);
  }
};

const unsetGAUserDimension = () => {
  window.ga('set', 'dimension1', '');
};

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
        payload: GUEST_PERMISSION_SET
      });
      setGAUserDimension(false);
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
      setGAUserDimension(false);
      return null;
    }).then((payload) => {
      // TODO import Google Analytics not through ga-react-router
      // window.ga('set', 'dimension1', payload.identity.userId);
      dispatch({
        type: SET_USER,
        payload: getUserData(payload)
      });
      dispatch({
        type: SET_USER_PERMISSIONS,
        payload: _.uniq(AUTH_PERMISSION_SET.concat(getAclData(payload)))
      });
      setGAUserDimension(payload);
    });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem(TOKEN_SESSION);
    dispatch({
      type: LOGOUT
    });
    unsetGAUserDimension();
    window.location.hash = window.location.hash.replace(/#access_token=([a-zA-Z0-9.\-_]*)/g, '');
    if (window.location.pathname.match('^/map')) {
      history.pushState({}, '', '/');
    }
  };
}

export function login() {
  window.location = `${MAP_API_ENDPOINT}/v1/authorize?\
response_type=token&client_id=asddafd&redirect_uri=${window.location}`;
}
