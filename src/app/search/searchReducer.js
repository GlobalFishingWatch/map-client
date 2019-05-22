import {
  SET_SEARCH_RESULTS,
  SET_SEARCH_TERM,
  SET_SEARCHING,
  SET_SEARCH_PAGE,
  SET_SEARCH_MODAL_VISIBILITY,
  SET_SEARCH_RESULTS_VISIBILITY,
  SET_HAS_HIDDEN_SEARCHABLE_LAYERS,
} from 'app/search/searchActions'

const initialState = {
  entries: [],
  count: 0,
  searchTerm: '',
  searching: false,
  searchModalOpen: false,
  searchResultsOpen: false,
  page: 0,
  hasSearchableLayers: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return Object.assign({}, state, {
        pageCount: action.payload.pageCount,
        entries: action.payload.entries,
        searching: false,
      })
    case SET_SEARCHING:
      return Object.assign({}, state, { searching: action.payload })
    case SET_SEARCH_PAGE:
      return Object.assign({}, state, { page: action.payload })
    case SET_SEARCH_TERM:
      return Object.assign({}, state, { searchTerm: action.payload })
    case SET_SEARCH_MODAL_VISIBILITY:
      return Object.assign({}, state, { searchModalOpen: action.payload })
    case SET_SEARCH_RESULTS_VISIBILITY:
      return Object.assign({}, state, { searchResultsOpen: action.payload })
    case SET_HAS_HIDDEN_SEARCHABLE_LAYERS:
      return Object.assign({}, state, {
        hasHiddenSearchableLayers: action.payload,
      })
    default:
      return state
  }
}
