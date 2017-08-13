import { FORM_RESPONSE } from 'siteNav/contactActions';

const initialState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case FORM_RESPONSE:
      return action.payload;
    default:
      return state;
  }
}
