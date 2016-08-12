import { GET_ARTICLES_PUBLICATIONS_ENTRIES } from '../actions';
import 'whatwg-fetch';

export function getArticlesPublicationsEntries() {
  return (dispatch) => {
    fetch('/articles-publications.json', {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      dispatch({
        type: GET_ARTICLES_PUBLICATIONS_ENTRIES,
        payload: data
      });
    });
  };
}
