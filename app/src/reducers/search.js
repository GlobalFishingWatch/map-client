import { GET_SEARCH_RESULTS, SET_SEARCH_KEYWORD, SET_SEARCH_MODAL_VISIBILITY } from 'actions';

const initialState = {
  entries: [],
  count: 0,
  keyword: '',
  modal: {
    open: false
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SEARCH_RESULTS:
      return Object.assign({}, state, action.payload);
    case SET_SEARCH_KEYWORD:
      return Object.assign({}, state, { keyword: action.payload });
    case SET_SEARCH_MODAL_VISIBILITY: {
      return Object.assign({}, state, {
        modal: {
          open: action.payload
        }
      });
    }
    default:
      return state;
  }
}
