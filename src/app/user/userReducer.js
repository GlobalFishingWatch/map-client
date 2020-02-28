import { SET_USER_PERMISSIONS, SET_USER, SET_TOKENS, LOGOUT } from 'app/user/userActions'
import { USER_TOKEN_STORAGE_KEY, USER_REFRESH_TOKEN_STORAGE_KEY } from 'app/constants'

const initialState = {
  token: localStorage.getItem(USER_TOKEN_STORAGE_KEY),
  refreshToken: localStorage.getItem(USER_REFRESH_TOKEN_STORAGE_KEY),
  loggedUser: null,
  userPermissions: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PERMISSIONS:
      return { ...state, userPermissions: action.payload }
    case SET_USER:
      return { ...state, loggedUser: action.payload }
    case SET_TOKENS: {
      const { token = state.token, refreshToken = state.refreshToken } = action.payload
      return { ...state, token, refreshToken }
    }
    case LOGOUT: {
      return { ...state, token: null, refreshToken: null, loggedUser: null, userPermissions: null }
    }
    default:
      return state
  }
}
