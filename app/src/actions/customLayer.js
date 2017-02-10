import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS
} from 'actions';
import { setLayerManagementModalVisibility } from 'actions/map';
import { addCustomLayer } from 'actions/layers';

export default function uploadLayer(url, name, description) {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_LAYER_UPLOAD_START,
      payload: 'pending'
    });
    fetch(url)
      .then((res) => {
        if (res.status >= 400) throw new Error(res.statusText)
        return res.json();
      })
      .then(() => {
        dispatch({
          type: CUSTOM_LAYER_UPLOAD_SUCCESS,
          payload: 'idle'
        });
        dispatch(setLayerManagementModalVisibility(false));

        // TODO get real URL from API
        const url = 'http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml';
        dispatch(addCustomLayer(url, name, description));
      });
  };
}
