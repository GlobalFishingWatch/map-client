import { setLayerManagementModalVisibility } from 'app/appActions';
import { addCustomLayer } from 'layers/layersActions';
import { addCustomGLLayer } from 'map/mapStyleActions';
import { CUSTOM_LAYERS_SUBTYPES } from 'constants';
import WMSCapabilities from 'wms-capabilities';
import URI from 'urijs';

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

const loadWMSCapabilities = (url) => {
  const urlSearch = new URI(url).search((data) => {
    data.request = 'GetCapabilities';
    data.service = 'WMS';
  });
  const promise = fetch(urlSearch)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.text();
    })
    .then((xmlString) => {
      const capabilities = new WMSCapabilities(xmlString).toJSON();
      if (capabilities.Capability === undefined) {
        throw new Error('Error with WMS endpoint');
      }

      const format = (capabilities.Capability.Request.GetMap.Format.indexOf('image/png') > -1)
        ? 'image/png'
        : 'image/jpeg';

      const tilesURL = new URI(capabilities.Service.OnlineResource).search(() => ({
        version: '1.1.0',
        request: 'GetMap',
        layers: capabilities.Capability.Layer.Layer.map((l, i) => i).join(','),
        styles: capabilities.Capability.Layer.Layer.map(l => l.Style[0].Name).join(','),
        srs: 'EPSG:3857',
        bbox: '{bbox-epsg-3857}',
        width: 256,
        height: 256,
        format,
        transparent: true
      }));
      return {
        layerId: new Date().getTime().toString(),
        finalUrl: decodeURIComponent(tilesURL.toString()),
        finalSubtype: CUSTOM_LAYERS_SUBTYPES.raster
      };
    });

  return promise;
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
      })
      .then(json => ({
        layerId: json.args.id,
        finalUrl: json.args.source.args.url,
        finalSubtype: subtype
      }));
  } else if (subtype === CUSTOM_LAYERS_SUBTYPES.raster) {
    // Can't use the /directory API for now as it will mess up with the original URL template
    uploadPromise = Promise.resolve({
      layerId: new Date().getTime().toString(),
      finalUrl: url,
      finalSubtype: subtype
    });
  } else if (subtype === 'wms') {
    uploadPromise = loadWMSCapabilities(url);
  }

  uploadPromise.then(({ layerId, finalUrl, finalSubtype }) => {
    loadCustomLayer(finalSubtype, finalUrl, token)
      .then((uploadedData) => {
        dispatch({
          type: CUSTOM_LAYER_UPLOAD_SUCCESS,
          payload: 'idle'
        });
        dispatch(setLayerManagementModalVisibility(false));
        dispatch(addCustomLayer(finalSubtype, layerId, finalUrl, name, description));
        dispatch(addCustomGLLayer(finalSubtype, layerId, finalUrl, uploadedData));
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
