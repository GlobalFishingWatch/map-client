import { setLayerManagementModalVisibility } from 'app/appActions';
import { addCustomLayer } from 'layers/layersActions';
import { addCustomGLLayer } from 'map/mapStyleActions';
import { CUSTOM_LAYERS_SUBTYPES } from 'constants';

export const CUSTOM_LAYER_UPLOAD_START = 'CUSTOM_LAYER_UPLOAD_START';
export const CUSTOM_LAYER_UPLOAD_SUCCESS = 'CUSTOM_LAYER_UPLOAD_SUCCESS';
export const CUSTOM_LAYER_UPLOAD_ERROR = 'CUSTOM_LAYER_UPLOAD_ERROR';
export const SET_CUSTOM_LAYER_DATA = 'SET_CUSTOM_LAYER_DATA';

export const loadCustomLayer = (id, url /* , subtype */) => (dispatch, getState) => {
  const state = getState();
  const token = state.user.token;

  // use kml as default as it was the 'historic' format. If not specified in workspace, assume kml
  // const layerSubtype = (subtype === undefined) ? CUSTOM_LAYERS_SUBTYPES.kml : subtype;

  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      if (res.status >= 400) throw new Error(res.statusText);
      // do KML to GeoJSON conversion here
      // if subtype...
      return res.json();
    })
    .then((data) => {
      dispatch({
        type: SET_CUSTOM_LAYER_DATA,
        payload: {
          id,
          data
        }
      });
      dispatch(addCustomGLLayer(id));
    });
};

export const uploadCustomLayer = (url, name, description) => (dispatch, getState) => {
  const state = getState();
  const token = state.user.token;

  dispatch({
    type: CUSTOM_LAYER_UPLOAD_START,
    payload: 'pending'
  });

  fetch(`${V2_API_ENDPOINT}/directory`, {
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

      // TODO set subtype with some form element
      dispatch(loadCustomLayer(layerId, newUrl, CUSTOM_LAYERS_SUBTYPES.geojson));
    })
    .catch(err => dispatch({ type: CUSTOM_LAYER_UPLOAD_ERROR, payload: { error: err, status: 'idle' } }));
};

