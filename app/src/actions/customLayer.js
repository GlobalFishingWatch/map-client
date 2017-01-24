import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS
} from 'actions';
import { setLayerManagementModalVisibility } from 'actions/map';

export default function uploadLayer() {
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
      });
  };
}
