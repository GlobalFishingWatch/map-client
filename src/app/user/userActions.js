import { AUTH_PERMISSION_SET, GUEST_PERMISSION_SET } from 'app/config'
import 'whatwg-fetch'
import uniq from 'lodash/uniq'
import { getURLParameterByName } from 'app/utils/getURLParameterByName'

const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL
const API_AUTH_URL = `${API_GATEWAY_URL}/auth`

export const SET_USER = 'SET_USER'
export const SET_USER_PERMISSIONS = 'SET_USER_PERMISSIONS'
export const SET_TOKENS = 'SET_TOKENS'
export const LOGOUT = 'LOGOUT'

// GTM = Google Tag Manager
const GTGELoginEventId = 'loggedInUser'

const setGAUserDimension = (user) => {
  window.dataLayer = window.dataLayer || []
  if (user !== false) {
    window.dataLayer.push({
      userID: user.identity.userId,
      event: GTGELoginEventId,
    })
  } else {
    window.dataLayer = window.dataLayer.filter((l) => l.event !== GTGELoginEventId)
  }
}

export function setTokens(tokens) {
  return {
    type: SET_TOKENS,
    payload: tokens,
  }
}

function getUserData(data) {
  if (
    data === undefined ||
    data === null ||
    data.firstName === undefined ||
    data.email === undefined
  ) {
    return null
  }

  return {
    displayName: data.firstName,
    email: data.email,
  }
}

function getAclData(data) {
  if (data === null || !data.permissions) return []
  return data.permissions
    .filter((feature) => feature.type === 'application' && feature.value === 'map-client')
    .map((feature) => feature.action)
}

async function getTokensWithAccessToken(accesToken) {
  return fetch(`${API_AUTH_URL}/token?access-token=${accesToken}`).then((r) => r.json())
}

async function getTokenWithRefreshToken(refreshToken) {
  const data = await fetch(`${API_AUTH_URL}/token/reload`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  }).then((r) => r.json())
  return data ? data.token : ''
}

export function getLoggedUser() {
  return async (dispatch, getState) => {
    const accessToken = getURLParameterByName('access-token')
    try {
      if (accessToken) {
        const tokens = await getTokensWithAccessToken(accessToken)
        dispatch(setTokens(tokens))
        window.location.search = window.location.search.replace(
          /access-token=([a-zA-Z0-9.\-_]*)/g,
          ''
        )
      }
    } catch (e) {
      console.log(e)
    }

    let token = getState().user.token
    const refreshToken = getState().user.refreshToken

    if (token) {
      const headers = { Authorization: `Bearer ${token}` }

      fetch(`${API_AUTH_URL}/me`, { method: 'GET', headers })
        .then((response) => response.json())
        .then((payload) => {
          if (payload && payload.identity) {
            setGAUserDimension(payload)
          } else {
            setGAUserDimension(false)
          }
          dispatch({
            type: SET_USER,
            payload: getUserData(payload),
          })
          dispatch({
            type: SET_USER_PERMISSIONS,
            payload: uniq(AUTH_PERMISSION_SET.concat(getAclData(payload))),
          })
        })
        .catch(async () => {
          setTokens({ token: null })
          setGAUserDimension(false)
          dispatch(getLoggedUser())
        })
    } else if (refreshToken) {
      token = await getTokenWithRefreshToken(refreshToken)
      dispatch(setTokens({ token }))
      dispatch(getLoggedUser())
    } else {
      dispatch({
        type: SET_USER_PERMISSIONS,
        payload: GUEST_PERMISSION_SET,
      })
    }
  }
}

export function logout() {
  return (dispatch, getState) => {
    dispatch({ type: LOGOUT })
    const token = getState().user.token
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    fetch(`${API_AUTH_URL}/logout`, { method: 'GET', headers })
    setGAUserDimension(false)
  }
}

export function getLoginUrl() {
  return `${API_AUTH_URL}?client=gfw&callback=${window.location.href}`
}

export function login() {
  window.location = getLoginUrl()
}
