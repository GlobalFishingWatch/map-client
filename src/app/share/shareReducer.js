import { SET_SHARE_MODAL_ERROR, SHARE_MODAL_OPEN } from 'app/share/shareActions'

const initialState = {
  shareModal: {
    open: false,
    error: null,
  },
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SHARE_MODAL_OPEN: {
      const shareModal = Object.assign({}, state.shareModal, {
        open: action.payload,
      })
      return Object.assign({}, state, { shareModal })
    }
    case SET_SHARE_MODAL_ERROR: {
      const newState = Object.assign({}, state)
      newState.shareModal.error = action.payload
      return newState
    }
    default:
      return state
  }
}
