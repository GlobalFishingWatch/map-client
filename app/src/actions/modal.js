import {
  SET_WELCOME_MODAL_VISIBILITY,
} from 'actions';

export function setWelcomeModalContent() {
  return (dispatch, getState) => {
    const state = getState();
    const url = state.modal.welcome.url;

    const request = new XMLHttpRequest();
    request.open('POST', MAP_API_ENDPOINT + endpoint, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (token) {
      request.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }
      dispatch({
        type: FORM_RESPONSE,
        payload: {
          status: request.status
        }
      });
    };

    const postData = [];
    const dataKeys = Object.keys(data);
    for (let index = 0, length = dataKeys.length; index < length; index++) {
      postData.push(`${dataKeys[index]}=${encodeURIComponent(data[dataKeys[index]])}`);
    }
    const postString = postData.length ? postData.join('&') : '';
    request.send(postString);
  };
}

export function setWelcomeModalVisibility(visibility) {
  return {
    type: SET_WELCOME_MODAL_VISIBILITY,
    payload: visibility
  };
}
