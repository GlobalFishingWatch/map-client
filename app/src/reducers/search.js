import {
  SET_SEARCH_RESULTS, SET_SEARCH_TERM, SET_SEARCH_MODAL_VISIBILITY, SET_SEARCHING, SET_SEARCH_PAGE, SET_SEARCH_RESULTS_VISIBILITY
} from 'actions';

const initialState = {
  entries: [],
  count: 0,
  searchTerm: '',
  searching: false,
  searchModalOpen: false,
  searchResultsOpen: false,
  page: 0
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return Object.assign({}, state, {
        count: action.payload.count,
        entries: action.payload.entries,
        searching: false
      });
    case SET_SEARCHING:
      return Object.assign({}, state, { searching: action.payload });
    case SET_SEARCH_PAGE:
      return Object.assign({}, state, { page: action.payload });
    case SET_SEARCH_TERM:
      return Object.assign({}, state, { searchTerm: action.payload });
    case SET_SEARCH_MODAL_VISIBILITY:
      return Object.assign({}, state, { searchModalOpen: action.payload });
    case SET_SEARCH_RESULTS_VISIBILITY:
      return Object.assign({}, state, { searchResultsOpen: action.payload });
    default:
      return state;
  }
}
