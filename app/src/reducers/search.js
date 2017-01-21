import {   SET_SEARCH_STATUS,
  SET_SEARCH_TERM,
  SET_SEARCH_MODAL_VISIBILITY,
  SET_SEARCHING
} from 'actions';

const initialState = {
  entries: [],
  count: 0,
  searchTerm: '',
  searching: false,
  searchModalOpen: false,
  page: 0
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_STATUS:
      return Object.assign({}, state, action.payload);
    case SET_SEARCHING:
      return Object.assign({}, state, { searching: action.payload });
    case SET_SEARCH_TERM:
      return Object.assign({}, state, { searchTerm: action.payload });
    case SET_SEARCH_MODAL_VISIBILITY: {
      return Object.assign({}, state, { searchModalOpen: action.payload });
    }
    default:
      return state;
  }
}
