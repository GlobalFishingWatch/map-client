import { GET_RECENT_POST } from '../constants';
import 'whatwg-fetch';

const url = 'http://beta.globalfishingwatch.org/api';

export function getRecentPost() {
  return (dispatch) => {
    fetch(`${url}/get_recent_posts/`, {
      method: 'GET'
    }).then((response) => response.json()).then((user) => {
      dispatch({
        type: GET_RECENT_POST,
        payload: user
      });
    });
  };
}
