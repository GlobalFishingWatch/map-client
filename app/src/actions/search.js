import { GET_SEARCH_RESULTS } from '../constants';
import 'whatwg-fetch';

const url = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/search/';

export function getSearchResults(searchTerm) {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.user.token) {
      dispatch({
        type: GET_SEARCH_RESULTS,
        payload: null
      });
    }

    fetch(`${url}?query=${searchTerm}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${state.user.token}`
      }
    }).then((response) => response.json()).then((result) => {
      dispatch({
        type: GET_SEARCH_RESULTS,
        payload: {
          entries: result.entries,
          count: result.total
        }
      });
    });
  };
}
