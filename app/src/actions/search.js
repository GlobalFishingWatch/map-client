import { SET_SEARCH_RESULTS } from '../actions';
import 'whatwg-fetch';

/**
 * Reset the search results to their initial state
 *
 * @export resetSearchResults
 * @returns {Object}
 */
export function resetSearchResults() {
  return {
    type: SET_SEARCH_RESULTS,
    payload: {
      entries: [],
      count: -1
    }
  };
}

export function getSearchResults(searchTerm) {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.user.token) {
      dispatch(resetSearchResults());
    } else if (searchTerm) {
      fetch(`${API_URL}/tilesets/tms-format-2015-2016-v1/search/?query=${searchTerm}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      }).then((response) => response.json()).then((result) => {
        dispatch({
          type: SET_SEARCH_RESULTS,
          payload: {
            entries: result.entries,
            count: result.total
          }
        });
      });
    }
  };
}
