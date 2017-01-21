import { SET_SEARCH_STATUS, SET_SEARCH_KEYWORD, SET_SEARCH_MODAL_VISIBILITY, SET_SEARCHING } from 'actions';

const initialState = {
  entries: [],
  count: 0,
  keyword: '',
  searching: false,
  searchModalOpen: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_STATUS:
      return Object.assign({}, state, action.payload);
    case SET_SEARCHING:
      return Object.assign({}, state, { searching: action.payload });
    case SET_SEARCH_KEYWORD:
      return Object.assign({}, state, { keyword: action.payload });
    case SET_SEARCH_MODAL_VISIBILITY: {
      return Object.assign({}, state, { searchModalOpen: action.payload });
    }
    default:
      return state;
  }
}
