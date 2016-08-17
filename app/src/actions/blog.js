import { push } from 'react-router-redux';
import { GET_RECENT_POSTS, GET_POST_BY_SLUG } from '../actions';
import 'whatwg-fetch';

export function updateURL(page) {
  return (dispatch) => {
    if (page === 1) {
      dispatch(push('/blog'));
    } else {
      dispatch(push(`/blog?page=${page}`));
    }
  };
}

export function getRecentPost(page) {
  return (dispatch) => {
    dispatch({
      type: GET_RECENT_POSTS,
      payload: null
    });

    fetch(`${BLOG_API_ENDPOINT}/api/get_recent_posts/?page=${page}`, {
      method: 'GET'
    }).then((response) => response.json()).then((posts) => {
      dispatch(updateURL(page));
      dispatch({
        type: GET_RECENT_POSTS,
        payload: posts
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
