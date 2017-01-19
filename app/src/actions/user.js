import { GET_USER, SET_TOKEN, TOKEN_SESSION, LOGOUT, SET_CURRENT_PATHNAME } from '../actions';
import 'whatwg-fetch';
import { browserHistory } from 'react-router';
import ga from 'ga-react-router';


const setGAPageView = (pathname) => {
  ga('set', 'page', pathname);
  ga('send', 'pageview');
};

const setGAUserDimension = (user, currentPathname) => {
  if (user !== false) {
    window.ga('set', 'dimension1', user.identity.userId);
  }

  // trigger initial page view
  setGAPageView(currentPathname);
};

const unsetGAUserDimension = () => {
  window.ga('set', 'dimension1', '');
};

export function triggerAnalyticsPageView(pathname) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CURRENT_PATHNAME,
      payload: {
        pathname
      }
    });
    if (getState().user.loggedUser === undefined) {
      // auth process did not start yet: loggedUser will later be either an object, or null, but not undefined
      // we'll trigger initial page view after auth finished (successfully or not), in setGAUserDimension()
      return;
    }
    setGAPageView(pathname);
  };
}

export function setToken(token) {
  localStorage.setItem(TOKEN_SESSION, token);
  return {
    type: SET_TOKEN,
    payload: token
  };
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
        type: GET_USER,
        payload: null
      });
      setGAUserDimension(false, state.user.currentPathname);
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
      setGAUserDimension(false, state.user.currentPathname);
      return null;
    }).then((user) => {
      dispatch({
        type: GET_USER,
        payload: user
      });
      setGAUserDimension(user, state.user.currentPathname);
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
      browserHistory.push('/');
    }
  };
}

export function login() {
  window.location = `${MAP_API_ENDPOINT}/v1/authorize?\
response_type=token&client_id=asddafd&redirect_uri=${window.location}`;
}
