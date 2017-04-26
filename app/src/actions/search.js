import {
  SET_SEARCH_RESULTS,
  SET_SEARCH_MODAL_VISIBILITY,
  SET_SEARCHING,
  SET_SEARCH_TERM,
  SET_SEARCH_PAGE,
  SET_SEARCH_RESULTS_VISIBILITY
} from 'actions';
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

      // TODO: Remove in favor of doing a serch per vessel layer
      result.entries.forEach((entry) => { entry.tilesetId = state.map.tilesetId; });
      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: {
          entries: result.entries, count: result.total
        }
      });
    });
}, 200);

export function setSearchPage(page) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({
      type: SET_SEARCHING, payload: (state.search.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT)
    });

    dispatch({
      type: SET_SEARCH_PAGE, payload: page
    });

    loadSearchResults(state.search.searchTerm, page, state, dispatch);
  };
}

export function setSearchTerm(searchTerm = null) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({
      type: SET_SEARCH_PAGE, payload: 0
    });

    if (searchTerm !== null) {
      dispatch({
        type: SET_SEARCH_TERM, payload: searchTerm
      });
      dispatch({
        type: SET_SEARCHING, payload: (searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT)
      });
    }

    // If the user is not logged in or the search term is less than 3 characters,
    // we reset the list of results to be empty
    if (searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT) {
      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: {
          entries: [], count: 0
        }
      });
      return;
    }

    loadSearchResults(searchTerm, 0, state, dispatch);
  };
}

export function setSearchModalVisibility(visibility) {
  return {
    type: SET_SEARCH_MODAL_VISIBILITY, payload: visibility
  };
}

export function setSearchResulVisibility(visibility) {
  return {
    type: SET_SEARCH_RESULTS_VISIBILITY, payload: visibility
  };
}
