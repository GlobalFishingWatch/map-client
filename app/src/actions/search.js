import { SET_SEARCH_STATUS, SET_SEARCH_MODAL_VISIBILITY } from 'actions';
import { SEARCH_QUERY_MINIMUM_LIMIT } from 'constants';
import 'whatwg-fetch';
import _ from 'lodash';

let searchQueryID = 0;

export function getSearchResults(searchTerm) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({
      type: SET_SEARCH_STATUS,
      payload: {
        keyword: searchTerm, searching: (searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT)
      }
    });

    // If the user is not logged in or the keyword is less than 3 characters,
    // we reset the list of results to be empty
    if (searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT) {
      dispatch({
        type: SET_SEARCH_STATUS,
        payload: {
          entries: [], count: 0
        }
      });
      return;
    }

    const doSearchAPICall = _.debounce(() => {
      // ID of the current request
      const queryID = ++searchQueryID;
      const options = {
        method: 'GET'
      };
      if (state.user.token) {
        options.headers = {
          Authorization: `Bearer ${state.user.token}`
        };
      }
      fetch(`${state.map.tilesetUrl}/search/?query=${searchTerm}`, options)
        .then((response) => response.json()).then((result) => {
          // We ensure to only show the results of the last request
          if (queryID !== searchQueryID) {
            return;
          }

          dispatch({
            type: SET_SEARCH_STATUS,
            payload: {
              entries: result.entries, count: result.total, searching: false
            }
          });
        });
    }, 200);

    doSearchAPICall(searchTerm);
  };
}

export function setSearchModalVisibility(visibility) {
  return {
    type: SET_SEARCH_MODAL_VISIBILITY, payload: visibility
  };
}
