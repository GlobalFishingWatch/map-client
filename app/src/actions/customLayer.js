import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS
} from 'actions';
import { setLayerManagementModalVisibility } from 'actions/map';
import { addCustomLayer } from 'actions/layers';

export default function uploadLayer(file, name, description) {
  return (dispatch) => {
    dispatch({
      type: CUSTOM_LAYER_UPLOAD_START,
      payload: 'pending'
    });
    fetch('http://www.vizzuality.com/')
      .then(() => {
        console.warn('simulated call to API done');
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
