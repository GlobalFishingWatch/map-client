import { GET_FAQ_ENTRIES } from '../constants';
import 'whatwg-fetch';

export function getFAQEntries() {
  return (dispatch) => {
    fetch('/faq.json', {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      dispatch({
        type: GET_FAQ_ENTRIES,
        payload: data
      });
    });
  };
}
