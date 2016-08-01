import {FORM_RESPONSE} from '../constants';

const url = 'https://skytruth-pleuston.appspot.com';

export function submitForm(data, endpoint) {
  return (dispatch, getState) => {
    let state = getState();
    let token = state.user.token;

    var request = new XMLHttpRequest();
    request.open("POST", url + endpoint, true);
    request.setRequestHeader('Authorization', 'Bearer ' + state.user.token);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (token) {
      request.setRequestHeader('Authorization', 'Bearer ' + token);
    }
    request.onreadystatechange = function () {
      if (request.readyState != 4) return;
      dispatch({
        type: FORM_RESPONSE,
        payload: request.status
      });
    };

    let postData = [];
    const dataKeys = Object.keys(data);
    for (let index = 0, length = dataKeys.length; index < length; index++) {
      postData.push(dataKeys[index] + "=" + encodeURIComponent(data[dataKeys[index]]));
    }
    let postString = postData.length ? postData.join('&') : '';
    request.send(postString);
  };
}
