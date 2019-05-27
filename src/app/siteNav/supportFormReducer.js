import { FORM_RESPONSE, SET_SUPPORT_MODAL_VISIBILITY } from 'app/siteNav/supportFormActions'

const initialState = {
  open: false,
  supportRequestStatus: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FORM_RESPONSE:
      return Object.assign({}, state, { supportRequestStatus: action.payload })
    case SET_SUPPORT_MODAL_VISIBILITY:
      return Object.assign({}, state, { open: action.payload })
    default:
      return state
  }
}
