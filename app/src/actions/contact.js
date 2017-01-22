import { FORM_RESPONSE } from 'actions';

export function submitForm(data, endpoint) {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.user.token;

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

export { submitForm as default };
