import { AUTH_PERMISSION_SET, GUEST_PERMISSION_SET } from 'app/config'
import 'whatwg-fetch'
import uniq from 'lodash/uniq'
import { getURLParameterByName } from 'app/utils/getURLParameterByName'
import fetchEndpoint from 'app/utils/fetchEndpoint'
import GFWAPI from '@globalfishingwatch/api-client'

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

function getAclData(permissions) {
  if (!permissions) return []
  return permissions
    .filter((feature) => feature.type === 'application' && feature.value === 'map-client')
    .map((feature) => feature.action)
}

function removeUrlToken() {
  if (window.history.replaceState) {
    window.history.replaceState(
      null,
      '',
      window.location.pathname +
        window.location.search.replace(/[?&]access-token=[^&]+/, '').replace(/^&/, '?') +
        window.location.hash
    )
  }
}

export function getLoggedUser() {
  return async (dispatch) => {
    const accessToken = getURLParameterByName('access-token')

    try {
      const user = await GFWAPI.login({ accessToken })
      if (user) {
        if (accessToken) {
          removeUrlToken()
        }
        const tokens = {
          token: GFWAPI.getToken(),
          refreshToken: GFWAPI.getRefreshToken(),
        }
        dispatch(setTokens(tokens))
        try {
          if (user && user.identity) {
            setGAUserDimension(user)
          } else {
            setGAUserDimension(false)
          }
          dispatch({
            type: SET_USER,
            payload: getUserData(user),
          })
          dispatch({
            type: SET_USER_PERMISSIONS,
            payload: uniq(AUTH_PERMISSION_SET.concat(getAclData(user.permissions))),
          })
        } catch (e) {
          setGAUserDimension(false)
        }
      } else {
        const guestPermissions = await fetchEndpoint('/auth/acl/permissions/anonymous')
        dispatch({
          type: SET_USER_PERMISSIONS,
          payload: getAclData(guestPermissions),
        })
      }
    } catch (e) {
      console.warn('Error trying to login', e)
      dispatch({
        type: SET_USER_PERMISSIONS,
        payload: GUEST_PERMISSION_SET,
      })
    }
  }
}

export function logout() {
  return (dispatch) => {
    GFWAPI.logout()
    dispatch({ type: LOGOUT })
    setGAUserDimension(false)
  }
}

export function getLoginUrl() {
  const callback = window.location.href
  return GFWAPI.getLoginUrl(callback)
}

export function login() {
  window.location = getLoginUrl()
}
