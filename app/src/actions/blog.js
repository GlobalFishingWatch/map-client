import { GET_RECENT_POST, GET_POST_BY_SLUG } from '../actions';
import 'whatwg-fetch';

const url = 'http://beta.globalfishingwatch.org/api';

export function getRecentPost() {
  return (dispatch) => {
    fetch(`${url}/get_recent_posts/`, {
      method: 'GET'
    }).then((response) => response.json()).then((user) => {
      dispatch({
        type: GET_RECENT_POST,
        payload: user
      });
    });
  };
}

export function getPostBySlug(slug) {
  return (dispatch) => {
    fetch(`${url}/get_post/?post_slug=${slug}`, {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      dispatch({
        type: GET_POST_BY_SLUG,
        payload: data.post
      });
    });
  };
}
