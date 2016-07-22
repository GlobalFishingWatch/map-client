import {GET_USER, SET_TOKEN, TOKEN_SESSION} from "../constants";
import "whatwg-fetch";

const url = 'https://skytruth-pleuston.appspot.com'

export function getLoggedUser() {
  return (dispatch, getState) => {
    let state = getState();
    let token = state.user.token;
    if ((!state.user || !state.user.token) && (sessionStorage.getItem(TOKEN_SESSION))) {
      token = sessionStorage.getItem(TOKEN_SESSION);
      dispatch(setToken(token));
    }
    fetch(`${url}/v1/me`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((user) => {
      dispatch({
        type: GET_USER,
        payload: user
      });
    });
  };
};

export function setToken(token) {
  // Almacena la información en sessionStorage
  sessionStorage.setItem(TOKEN_SESSION, token);
  return {
    type: SET_TOKEN,
    payload: token
  };
}
