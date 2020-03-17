import 'whatwg-fetch'

export const SET_WELCOME_MODAL_VISIBILITY = 'SET_WELCOME_MODAL_VISIBILITY'
export const SET_WELCOME_MODAL_CONTENT = 'SET_WELCOME_MODAL_CONTENT'
export const SET_WELCOME_MODAL_CONTENT_ERROR = 'SET_WELCOME_MODAL_CONTENT_ERROR'
export const SET_WELCOME_MODAL_URL = 'SET_WELCOME_MODAL_URL'

export function setWelcomeModalUrl() {
  if (!process.env.REACT_APP_WELCOME_MODAL_COOKIE_KEY) {
    return { type: SET_WELCOME_MODAL_URL, payload: null }
  }
  const cookie = document.cookie.split(process.env.REACT_APP_WELCOME_MODAL_COOKIE_KEY)
  if (cookie.length < 2) {
    return { type: SET_WELCOME_MODAL_URL, payload: null }
  }
  const url = cookie[1].split('=')[1].split(';')[0] || null
  return { type: SET_WELCOME_MODAL_URL, payload: url }
}

export function setWelcomeModalContent() {
  return (dispatch, getState) => {
    const state = getState()
    const url = state.welcomeModal.url

    fetch(url)
      .then((res) => {
        if (res.status >= 400) throw new Error(res.statusText)
        return res.text()
      })
      .then((body) => {
        dispatch({ type: SET_WELCOME_MODAL_CONTENT, payload: body })
        dispatch(setWelcomeModalVisibility(true))
      })
      .catch((err) => dispatch({ type: SET_WELCOME_MODAL_CONTENT_ERROR, payload: err }))
  }
}

export function setWelcomeModalVisibility(visibility) {
  return {
    type: SET_WELCOME_MODAL_VISIBILITY,
    payload: visibility,
  }
}
