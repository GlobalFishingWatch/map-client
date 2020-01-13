import { SEARCH_QUERY_MINIMUM_LIMIT, SEARCH_MODAL_PAGE_SIZE } from 'app/config'
import { LAYER_TYPES, ENCOUNTERS_AIS } from 'app/constants'
import 'whatwg-fetch'
import debounce from 'lodash/debounce'
import getVesselName from 'app/utils/getVesselName'
import buildEndpoint from 'app/utils/buildEndpoint'
import fetchEndpoint from 'app/utils/fetchEndpoint'

export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS'
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM'
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE'
export const SET_SEARCHING = 'SET_SEARCHING'
export const SET_SEARCH_MODAL_VISIBILITY = 'SET_SEARCH_MODAL_VISIBILITY'
export const SET_SEARCH_RESULTS_VISIBILITY = 'SET_SEARCH_RESULTS_VISIBILITY'
export const SET_HAS_HIDDEN_SEARCHABLE_LAYERS = 'SET_HAS_HIDDEN_SEARCHABLE_LAYERS'

const loadSearchResults = debounce((searchTerm, page, state, dispatch) => {
  if (searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT) {
    return
  }

  const searchableLayers = state.layers.workspaceLayers
    .filter((layer) => layer.header !== undefined)
    .filter((layer) => layer.header.searchable !== false)
    .filter((layer) => layer.added === true)

  const searchableAndVisibleLayers = searchableLayers.filter((layer) => {
    if (layer.visible === true) {
      return true
    }
    // for HeatmapTracksOnly layers (reefers): search only if "parent" encounter layer is visible
    // this should be improved to:
    // - manage the case where there is more than 1 encounter layer in workspace?
    // - apply the same logic to a vessel layer that has an encounter "parent": if vessel layer
    // is not visible but encounter layer is visible, search should be done on vessel layer
    if (layer.type === LAYER_TYPES.HeatmapTracksOnly) {
      const encountersLayer = state.layers.workspaceLayers.find((l) => l.id === ENCOUNTERS_AIS)
      return encountersLayer && encountersLayer.visible === true
    }
    return false
  })

  const hasHiddenSearchableLayers = searchableLayers.length !== searchableAndVisibleLayers.length
  dispatch({
    type: SET_HAS_HIDDEN_SEARCHABLE_LAYERS,
    payload: hasHiddenSearchableLayers,
  })

  if (!searchableAndVisibleLayers.length) {
    dispatch({
      type: SET_SEARCH_RESULTS,
      payload: {
        entries: [],
      },
    })
    return
  }

  const searchEndpoints = searchableAndVisibleLayers
    .map((l) => {
      let endpoint = {
        url: l.header.endpoints.search,
        tilesetId: l.tilesetId,
      }
      return endpoint
    })
    .filter((l) => l.tilesetId !== undefined)

  // Deduplicate search endpoints. Keep all layer tilesetIds to build the final URL
  const uniqSearchEndpoints = {}
  searchEndpoints.forEach((searchEndpoint) => {
    if (uniqSearchEndpoints[searchEndpoint.url] === undefined) {
      uniqSearchEndpoints[searchEndpoint.url] = []
    }
    uniqSearchEndpoints[searchEndpoint.url].push(searchEndpoint.tilesetId)
  })

  // build uniq search URLs with all get params
  const uniqSearchURLs = Object.keys(uniqSearchEndpoints).map((searchEndpointURL) => {
    return buildEndpoint(searchEndpointURL, {
      tilesets: uniqSearchEndpoints[searchEndpointURL].join(','),
      query: encodeURIComponent(searchTerm),
      limit: SEARCH_MODAL_PAGE_SIZE,
      offset: page * SEARCH_MODAL_PAGE_SIZE,
    })
  })

  const searchPromises = uniqSearchURLs.map((url) => fetchEndpoint(url).catch((err) => err))

  Promise.all(searchPromises).then((resultsOrErrors) => {
    let entries = []
    let total = 0
    let numEndpoints = 0
    resultsOrErrors.forEach((resultOrError, i) => {
      if (resultOrError instanceof Error) {
        console.error('Error loading search results', uniqSearchURLs[i], resultOrError)
      } else {
        entries = entries.concat(resultOrError.entries)
        total += resultOrError.total
        numEndpoints++
      }
    })

    // Very simple but really not ideal: when querying n endpoints the number of results
    // displayed is n * SEARCH_MODAL_PAGE_SIZE :/
    const numResultsPerPage = numEndpoints * SEARCH_MODAL_PAGE_SIZE
    const pageCount = Math.ceil(total / numResultsPerPage)
    entries = entries.map((entry) => {
      const layer = searchableAndVisibleLayers.find((l) => l.tilesetId === entry.tilesetId)
      const title = getVesselName(entry, layer.header.info.fields)
      return { ...entry, title, layerTitle: layer.title }
    })
    dispatch({
      type: SET_SEARCH_RESULTS,
      payload: {
        entries,
        pageCount,
        totalResults: total,
      },
    })
  })
}, 200)

export function setSearchPage(page) {
  return (dispatch, getState) => {
    const state = getState()

    dispatch({
      type: SET_SEARCHING,
      payload: state.search.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT,
    })

    dispatch({
      type: SET_SEARCH_PAGE,
      payload: page,
    })

    loadSearchResults(state.search.searchTerm, page, state, dispatch)
  }
}

export function setSearchTerm(searchTerm = null) {
  return (dispatch, getState) => {
    const state = getState()

    dispatch({
      type: SET_SEARCH_PAGE,
      payload: 0,
    })

    if (searchTerm !== null) {
      dispatch({
        type: SET_SEARCH_TERM,
        payload: searchTerm,
      })
      dispatch({
        type: SET_SEARCHING,
        payload: searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT,
      })
    }

    // If the user is not logged in or the search term is less than 3 characters,
    // we reset the list of results to be empty
    if (searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT) {
      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: {
          entries: [],
          count: 0,
        },
      })
      return
    }

    loadSearchResults(searchTerm, 0, state, dispatch)
  }
}

export function setSearchModalVisibility(visibility) {
  return {
    type: SET_SEARCH_MODAL_VISIBILITY,
    payload: visibility,
  }
}

export function setSearchResultVisibility(visibility) {
  return {
    type: SET_SEARCH_RESULTS_VISIBILITY,
    payload: visibility,
  }
}
