import { GET_ARTICLES_PUBLICATIONS_ENTRIES } from 'actions';
import 'whatwg-fetch';

export function getArticlesPublicationsEntries() {
  return (dispatch) => {
    fetch(ART_PUB_JSON_URL, {
      method: 'GET'
    }).then(response => response.json()).then((data) => {
      dispatch({
        type: GET_ARTICLES_PUBLICATIONS_ENTRIES,
        payload: data
      });
    });
  };
}

export { getArticlesPublicationsEntries as default };
