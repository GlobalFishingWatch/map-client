import {GET_RECENT_POST, GET_POST_BY_ID} from "../constants";
import "whatwg-fetch";

const url = 'http://beta.globalfishingwatch.org/api'

export function getRecentPost() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${url}/get_recent_posts/`, {
      method: 'GET'
    }).then((response) => {
      return response.json()
    }).then((user) => {
      dispatch({
        type: GET_RECENT_POST,
        payload: user
      });
    });
  };
};

export function getPostById(id) {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${url}/get_post/?post_id=${id}`, {
      method: 'GET'
    }).then((response) => {
      return response.json()
    }).then((data) => {
      dispatch({
        type: GET_POST_BY_ID,
        payload: data.post
      });
    });
  };
};
