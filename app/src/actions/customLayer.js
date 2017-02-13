import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS
} from 'actions';
import { setLayerManagementModalVisibility } from 'actions/map';
import { addCustomLayer } from 'actions/layers';

export default function uploadCustomLayer(url, name, description) {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.user.token;

    dispatch({
      type: CUSTOM_LAYER_UPLOAD_START,
      payload: 'pending'
    });

    fetch(`${MAP_API_ENDPOINT}/v1/directory`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ title: name, url, description })
    })
      .then((res) => {
        if (res.status >= 400) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        const layerId = data.args.id;
        const newUrl = data.args.source.args.url;
        dispatch({
          type: CUSTOM_LAYER_UPLOAD_SUCCESS,
          payload: 'idle'
        });
        dispatch(setLayerManagementModalVisibility(false));
        dispatch(addCustomLayer(layerId, newUrl, name, description));
      });
  };
}
