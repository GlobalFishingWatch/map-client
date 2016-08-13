import { GET_RECENT_POST, GET_POST_BY_SLUG } from '../actions';
import 'whatwg-fetch';

export function getRecentPost() {
  return (dispatch) => {
    fetch(`${BLOG_API_ENDPOINT}/api/get_recent_posts/`, {
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
    fetch(`${BLOG_API_ENDPOINT}/api/get_post/?post_slug=${slug}`, {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      dispatch({
        type: GET_POST_BY_SLUG,
        payload: data.post
      });
    });
  };
}
