import { SEARCH_QUERY_MINIMUM_LIMIT, SEARCH_MODAL_PAGE_SIZE } from 'config';
import { LAYER_TYPES } from 'constants';
import 'whatwg-fetch';
import debounce from 'lodash/debounce';
import getVesselName from 'util/getVesselName';
import buildEndpoint from 'util/buildEndpoint';

export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCHING = 'SET_SEARCHING';
export const SET_SEARCH_MODAL_VISIBILITY = 'SET_SEARCH_MODAL_VISIBILITY';
export const SET_SEARCH_RESULTS_VISIBILITY = 'SET_SEARCH_RESULTS_VISIBILITY';

let searchQueryID = 0;

const loadSearchResults = debounce((searchTerm, page, state, dispatch) => {
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

  let searchResultList = [];
  let searchResultCount = 0;

  const layers = state.layers.workspaceLayers
    .filter(layer => layer.type === LAYER_TYPES.Heatmap)
    .filter(layer => layer.added === true);

  const searchLayerPromises = layers
    .map(layer =>
      fetch(buildEndpoint(layer.header.endpoints.search, {
        query: encodeURIComponent(searchTerm),
        limit: SEARCH_MODAL_PAGE_SIZE,
        offset: page * SEARCH_MODAL_PAGE_SIZE
      }), options)
        .then(response => response.json())
        .then((result) => {
          if (queryID !== searchQueryID) {
            return;
          }

          result.entries.forEach((entry) => {
            entry.tilesetId = layer.tilesetId;
            entry.title = getVesselName(entry, layer.header.info.fields);
          });
          searchResultList = searchResultList.concat(result.entries);
          searchResultCount += result.total;
        })
    );

  Promise.all(searchLayerPromises)
    .then(() => {
      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: {
          entries: searchResultList, count: searchResultCount
        }
      });
    }
    );
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

export function setSearchResultVisibility(visibility) {
  return {
    type: SET_SEARCH_RESULTS_VISIBILITY, payload: visibility
  };
}
