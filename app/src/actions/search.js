import { SET_SEARCH_STATUS, SET_SEARCH_MODAL_VISIBILITY } from 'actions';
import { SEARCH_QUERY_MINIMUM_LIMIT, SEARCH_MODAL_PAGE_SIZE } from 'constants';
import 'whatwg-fetch';
import _ from 'lodash';

let searchQueryID = 0;

const loadSearchResults = _.debounce((searchTerm, page, state, dispatch) => {
  if (searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT) {
    return;
  }

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

  const searchParams = {
    query: searchTerm,
    limit: SEARCH_MODAL_PAGE_SIZE,
    offset: page * SEARCH_MODAL_PAGE_SIZE
  };
  const queryArgs = Object.keys(searchParams).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(searchParams[k])}`).join('&');

  fetch(`${state.map.tilesetUrl}/search/?${queryArgs}`, options)
    .then(response => response.json()).then((result) => {
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

export function setSearchPage(page) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({
      type: SET_SEARCH_STATUS,
      payload: {
        searching: (state.search.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT),
        page
      }
    });

    loadSearchResults(state.search.searchTerm, page, state, dispatch);
  };
}

export function setSearchTerm(searchTerm = null) {
  return (dispatch, getState) => {
    const state = getState();

    if (searchTerm !== null) {
      dispatch({
        type: SET_SEARCH_STATUS,
        payload: {
          searchTerm,
          searching: (searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT)
        }
      });
    }

    // If the user is not logged in or the search term is less than 3 characters,
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

    loadSearchResults(searchTerm, state.search.page, state, dispatch);
  };
}

export function setSearchModalVisibility(visibility) {
  return {
    type: SET_SEARCH_MODAL_VISIBILITY, payload: visibility
  };
}
