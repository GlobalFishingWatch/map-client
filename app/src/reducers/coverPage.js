import { GET_COVER_PAGE_ENTRIES } from 'actions';

const initialState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_COVER_PAGE_ENTRIES:
      return action.payload;
    default:
      return state;
  }
}
