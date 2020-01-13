import { setLayerManagementModalVisibility } from 'app/app/appActions'
import { addCustomLayer } from 'app/layers/layersActions'
import { CUSTOM_LAYERS_SUBTYPES } from 'app/constants'
import isURL from 'validator/lib/isURL'
import WMSCapabilities from 'wms-capabilities'
import URI from 'urijs'
import fetchEndpoint from 'app/utils/fetchEndpoint'

export const CUSTOM_LAYER_UPLOAD_START = 'CUSTOM_LAYER_UPLOAD_START'
export const CUSTOM_LAYER_UPLOAD_SUCCESS = 'CUSTOM_LAYER_UPLOAD_SUCCESS'
export const CUSTOM_LAYER_UPLOAD_ERROR = 'CUSTOM_LAYER_UPLOAD_ERROR'
export const CUSTOM_LAYER_RESET = 'CUSTOM_LAYER_RESET'

export const loadCustomLayer = ({ subtype, id, url }) => {
  const loadPromise = fetchEndpoint(url).then((json) => ({
    data: json,
    subtype,
    id,
    url,
  }))
  return loadPromise
}

const loadWMSCapabilities = ({ id, url }) => {
  const urlSearch = new URI(url).search((data) => {
    data.request = 'GetCapabilities'
    data.service = 'WMS'
  })
  const promise = fetch(urlSearch)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText)
      return res.text()
    })
    .then((xmlString) => {
      const capabilities = new WMSCapabilities(xmlString).toJSON()
      if (capabilities.Capability === undefined) {
        throw new Error('Error with WMS endpoint')
      }

      return {
        id,
        url,
        capabilities,
        subtype: CUSTOM_LAYERS_SUBTYPES.raster,
      }
    })
  return promise
}

const getWMSURLFilterdByLayers = ({ url, capabilities }, layersActives) => {
  const format =
    capabilities.Capability.Request.GetMap.Format.indexOf('image/png') > -1
      ? 'image/png'
      : 'image/jpeg'

  const layersFiltered = capabilities.Capability.Layer.Layer.filter((l) =>
    layersActives.includes(l.Name)
  )

  const layersIds = layersFiltered.map((l) => l.Name).join(',')
  const styles = layersFiltered.map((l) => l.Style[0].Name).join(',')

  const tilesURL = new URI(url).search(() => ({
    version: '1.1.0',
    request: 'GetMap',
    srs: 'EPSG:3857',
    bbox: '{bbox-epsg-3857}',
    width: 256,
    height: 256,
    transparent: true,
    layers: layersIds,
    styles,
    format,
  }))
  return decodeURIComponent(tilesURL.toString())
}

const saveToDirectory = ({ token, subtype, name, description, url }) => {
  const savePromise = fetchEndpoint(`${process.env.REACT_APP_V2_API_ENDPOINT}/directory`, {
    method: 'POST',
    body: JSON.stringify({ title: name, url, description }),
  }).then((json) => ({
    token,
    subtype,
    id: json.args.id,
    url: json.args.source.args.url,
  }))

  return savePromise
}

export const uploadCustomLayer = (subtype, url, name, description) => (dispatch, getState) => {
  const state = getState()
  const token = state.user.token
  if (isURL(url.trim())) {
    dispatch({ type: CUSTOM_LAYER_UPLOAD_START })

    const promises = []
    if (subtype !== CUSTOM_LAYERS_SUBTYPES.raster) {
      promises.push(saveToDirectory)
    }
    if (subtype === CUSTOM_LAYERS_SUBTYPES.wms) {
      promises.push(loadWMSCapabilities)
    }
    if (subtype === CUSTOM_LAYERS_SUBTYPES.geojson) {
      promises.push(loadCustomLayer)
    }

    promises
      .reduce(
        (p, f) => p.then(f),
        Promise.resolve({
          token,
          subtype,
          name,
          url,
          description,
          id: new Date().getTime().toString(),
        })
      )
      .then((layer) => {
        const getSubLayers = ({ capabilities }) => {
          const layers =
            capabilities &&
            capabilities.Capability &&
            capabilities.Capability.Layer &&
            capabilities.Capability.Layer.Layer
          if (!layers) return []

          return layers.map((l) => ({
            id: l.Name,
            label: l.Title,
            description: l.Abstract,
          }))
        }

        dispatch({
          type: CUSTOM_LAYER_UPLOAD_SUCCESS,
          payload: {
            ...layer,
            subLayers: getSubLayers(layer),
          },
        })
      })
      .catch((err) =>
        dispatch({
          type: CUSTOM_LAYER_UPLOAD_ERROR,
          payload: {
            error: err.message === '' ? 'Error uploading layer' : err.message,
          },
        })
      )
  } else {
    dispatch({
      type: CUSTOM_LAYER_UPLOAD_ERROR,
      payload: { error: 'Please insert a valid url' },
    })
  }
}

const includeSubLayersDescription = (layer) => {
  const activeLayers = layer.subLayers.filter((l) => layer.subLayersActives.includes(l.id))
  return `${layer.description} </br> ${activeLayers.reduce(
    (acc, l) =>
      `${acc} <strong>${l.label}:</strong> ${l.description ||
        'No description provided'} </br></br>`,
    ''
  )}`
}

export const confirmCustomLayer = (layer) => (dispatch, getState) => {
  const { previewLayer } = getState().customLayer
  const newLayer = {
    ...previewLayer,
    name: layer.name,
    description: layer.description,
    subLayersActives: layer.subLayersActives,
  }
  if (layer.subtype === 'wms') {
    if (!layer.subLayersActives || !layer.subLayersActives.length > 0) {
      dispatch({
        type: CUSTOM_LAYER_UPLOAD_ERROR,
        payload: { error: 'Please select at least one sublayer' },
      })
      return null
    }
    newLayer.url = getWMSURLFilterdByLayers(newLayer, layer.subLayersActives)
    newLayer.description = includeSubLayersDescription(newLayer)
    newLayer.subtype = CUSTOM_LAYERS_SUBTYPES.raster
  }
  dispatch(setLayerManagementModalVisibility(false))
  dispatch(
    addCustomLayer(
      newLayer.subtype,
      newLayer.id,
      newLayer.url,
      newLayer.name,
      newLayer.description,
      newLayer.data
    )
  )

  dispatch({ type: CUSTOM_LAYER_RESET })
  return null
}

export const resetCustomLayerForm = () => ({
  type: CUSTOM_LAYER_RESET,
})
