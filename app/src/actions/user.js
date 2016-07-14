import {GET_USER, SET_TOKEN} from "../constants";
import "whatwg-fetch";

const url = 'https://skytruth-pleuston.appspot.com'

export function getLoggedUser() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${url}/v1/me`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + state.user.token
      }
    }).then((response) => {
      return response.json()
    }).then((user) => {
      dispatch({
        type: GET_USER,
        payload: user
      });
    });
  };
};

export function setToken(token) {
  return {
    type: SET_TOKEN,
    payload: token
  };
}
