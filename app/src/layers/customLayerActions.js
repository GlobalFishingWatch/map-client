import { setLayerManagementModalVisibility } from 'app/appActions';
import { addCustomLayer } from 'layers/layersActions';
import { addCustomGLLayer } from 'map/mapStyleActions';
import { CUSTOM_LAYERS_SUBTYPES } from 'constants';

export const CUSTOM_LAYER_UPLOAD_START = 'CUSTOM_LAYER_UPLOAD_START';
export const CUSTOM_LAYER_UPLOAD_SUCCESS = 'CUSTOM_LAYER_UPLOAD_SUCCESS';
export const CUSTOM_LAYER_UPLOAD_ERROR = 'CUSTOM_LAYER_UPLOAD_ERROR';
export const CUSTOM_LAYER_RESET = 'CUSTOM_LAYER_RESET';

export const loadCustomLayer = (subtype, url, token) => {
  let loadPromise;

  if (subtype === CUSTOM_LAYERS_SUBTYPES.geojson) {
    loadPromise = fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      });
  } else if (subtype === CUSTOM_LAYERS_SUBTYPES.raster) {
    loadPromise = Promise.resolve();
  }
  return loadPromise;
};

export const uploadCustomLayer = (subtype, url, name, description) => (dispatch, getState) => {
  const state = getState();
  const token = state.user.token;

  dispatch({
    type: CUSTOM_LAYER_UPLOAD_START,
    payload: 'pending'
  });

  let uploadPromise;
  if (subtype === CUSTOM_LAYERS_SUBTYPES.geojson) {
    uploadPromise = fetch(`${V2_API_ENDPOINT}/directory`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ title: name, url, description })
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      });
  } else if (subtype === CUSTOM_LAYERS_SUBTYPES.raster) {
    // Can't use the /directory API for now as it will mess up with the original URL template
    uploadPromise = Promise.resolve({
      args: {
        id: new Date().getTime().toString(),
        source: {
          args: {
            url
          }
        }
      }
    });
  }

  uploadPromise.then((data) => {
    const layerId = data.args.id;
    const newUrl = data.args.source.args.url;
    loadCustomLayer(subtype, newUrl, token)
      .then((uploadedData) => {
        dispatch({
          type: CUSTOM_LAYER_UPLOAD_SUCCESS,
          payload: 'idle'
        });
        dispatch(setLayerManagementModalVisibility(false));
        dispatch(addCustomLayer(subtype, layerId, newUrl, name, description));
        dispatch(addCustomGLLayer(subtype, layerId, newUrl, uploadedData));
      })
      .catch((err) => {
        dispatch({
          type: CUSTOM_LAYER_UPLOAD_ERROR,
          payload: { error: err.message }
        });
      });
  })
    .catch(err => dispatch({
      type: CUSTOM_LAYER_UPLOAD_ERROR,
      payload: { error: err.message }
    }));
};

export const resetCustomLayerForm = () => ({
  type: CUSTOM_LAYER_RESET
});
