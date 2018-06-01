import { SEARCH_QUERY_MINIMUM_LIMIT, SEARCH_MODAL_PAGE_SIZE } from 'config';
import { LAYER_TYPES_SEARCHABLE, LAYER_TYPES } from 'constants';
import 'whatwg-fetch';
import debounce from 'lodash/debounce';
import getVesselName from 'utils/getVesselName';
import buildEndpoint from 'utils/buildEndpoint';

export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE';
export const SET_SEARCHING = 'SET_SEARCHING';
export const SET_SEARCH_MODAL_VISIBILITY = 'SET_SEARCH_MODAL_VISIBILITY';
export const SET_SEARCH_RESULTS_VISIBILITY = 'SET_SEARCH_RESULTS_VISIBILITY';
export const SET_HAS_HIDDEN_SEARCHABLE_LAYERS = 'SET_HAS_HIDDEN_SEARCHABLE_LAYERS';

const loadSearchResults = debounce((searchTerm, page, state, dispatch) => {
  if (searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT) {
    return;
  }

  const options = {
    method: 'GET'
  };
  if (state.user.token) {
    options.headers = {
      Authorization: `Bearer ${state.user.token}`
    };
  }

  const searchableLayers = state.layers.workspaceLayers
    .filter(layer => LAYER_TYPES_SEARCHABLE.indexOf(layer.subtype || layer.type) > -1)
    .filter(layer =>
      layer.header.searchable !== false &&
      layer.header.endpoints.search !== null &&
      layer.header.endpoints.search !== undefined
    )
    .filter(layer => layer.added === true);

  const searchableAndVisibleLayers = searchableLayers
    .filter((layer) => {
      if (layer.visible === true) {
        return true;
      }
      // FIXME use encounters layer visibility to determine HeatmapTracksOnly layer visibility
      const encountersLayer = state.layers.workspaceLayers.find(l => l.subtype === LAYER_TYPES.Encounters);
      if (layer.type === LAYER_TYPES.HeatmapTracksOnly && encountersLayer && encountersLayer.visible === true) {
        return true;
      }
      return false;
    });

  const hasHiddenSearchableLayers = searchableLayers.length !== searchableAndVisibleLayers.length;
  dispatch({
    type: SET_HAS_HIDDEN_SEARCHABLE_LAYERS,
    payload: hasHiddenSearchableLayers
  });

  if (!searchableAndVisibleLayers.length) {
    dispatch({
      type: SET_SEARCH_RESULTS,
      payload: {
        entries: [],
        pageCount: 0
      }
    });
    return;
  }

  const searchLayerPromises = searchableAndVisibleLayers
    .map(layer =>
      fetch(buildEndpoint(layer.header.endpoints.search, {
        query: encodeURIComponent(searchTerm),
        limit: SEARCH_MODAL_PAGE_SIZE,
        offset: page * SEARCH_MODAL_PAGE_SIZE
      }), options)
        .then(response => response.json())
        .then(result => new Promise(resolve => resolve({ result, layer })))
    );

  Promise.all(searchLayerPromises)
    .then((resultContainers) => {
      if (resultContainers[0].result.query !== searchTerm) {
        console.warn('search term differs, searching for', searchTerm, 'receiving', resultContainers[0].result.query);
      }
      let searchResultList = [];
      let pageCount = 0;
      resultContainers.forEach((resultContainer) => {
        resultContainer.result.entries.forEach((entry) => {
          entry.tilesetId = resultContainer.layer.tilesetId;
          entry.title = getVesselName(entry, resultContainer.layer.header.info.fields);
        });
        searchResultList = searchResultList.concat(resultContainer.result.entries);
        const thisSearchPageCount = Math.ceil(resultContainer.result.total / resultContainer.result.limit);
        pageCount = Math.max(thisSearchPageCount, pageCount);
      });
      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: {
          entries: searchResultList,
          pageCount
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

export function setSearchResultVisibility(visibility) {
  return {
    type: SET_SEARCH_RESULTS_VISIBILITY, payload: visibility
  };
}
