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
      localStorage.setItem(USER_TOKEN_STORAGE_KEY, token)
      localStorage.setItem(USER_REFRESH_TOKEN_STORAGE_KEY, refreshToken)
      return { ...state, token, refreshToken }
    }
    case LOGOUT: {
      localStorage.setItem(USER_TOKEN_STORAGE_KEY, '')
      localStorage.setItem(USER_REFRESH_TOKEN_STORAGE_KEY, '')
      return { ...state, token: null, loggedUser: null }
    }
    default:
      return state
  }
}
