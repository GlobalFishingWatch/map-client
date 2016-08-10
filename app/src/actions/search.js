import { GET_SEARCH_RESULTS } from '../actions';
import 'whatwg-fetch';

export function getSearchResults(searchTerm) {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.user.token) {
      dispatch({
        type: GET_SEARCH_RESULTS,
        payload: null
      });
    }

    fetch(`${API_URL}/tilesets/tms-format-2015-2016-v1/search/?query=${searchTerm}`, {
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
