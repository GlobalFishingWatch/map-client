export const FORM_RESPONSE = 'FORM_RESPONSE'
export const SET_SUPPORT_MODAL_VISIBILITY = 'SET_SUPPORT_MODAL_VISIBILITY'

export function submitForm(data, endpoint) {
  return (dispatch, getState) => {
    const state = getState()
    const token = state.user.token

    const request = new XMLHttpRequest()
    request.open('POST', process.env.REACT_APP_API_GATEWAY_URL + endpoint, true)
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    if (token) {
      request.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }
      dispatch({
        type: FORM_RESPONSE,
        payload: {
          status: request.status,
        },
      })
    }

    const postData = []
    const dataKeys = Object.keys(data)
    for (let index = 0, length = dataKeys.length; index < length; index++) {
      postData.push(`${dataKeys[index]}=${encodeURIComponent(data[dataKeys[index]])}`)
    }
    const postString = postData.length ? postData.join('&') : ''
    request.send(postString)
  }
}

export function setSupportModalVisibility(visibility) {
  return {
    type: SET_SUPPORT_MODAL_VISIBILITY,
    payload: visibility,
  }
}

export { submitForm as default }
