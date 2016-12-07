import { GET_FAQ_ENTRIES } from 'actions';
import 'whatwg-fetch';

export function getFAQEntries() {
  return (dispatch) => {
    fetch(FAQ_JSON_URL, {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      dispatch({
        type: GET_FAQ_ENTRIES,
        payload: data
      });
    });
  };
}
