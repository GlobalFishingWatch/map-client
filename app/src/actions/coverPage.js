import { GET_COVER_PAGE_ENTRIES } from 'actions';
import 'whatwg-fetch';

export function getCoverPageEntries() {
  return (dispatch) => {
    fetch(HOME_SLIDER_JSON_URL, {
      method: 'GET'
    }).then((response) => response.json()).then((data) => {
      dispatch({
        type: GET_COVER_PAGE_ENTRIES,
        payload: data
      });
    });
  };
}
