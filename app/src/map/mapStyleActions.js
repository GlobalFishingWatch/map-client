import { LAYER_TYPES_MAPBOX_GL } from 'constants';
import { NO_FILL_FILL, STATIC_LAYERS_CARTO_ENDPOINT, STATIC_LAYERS_CARTO_TILES_ENDPOINT } from 'config';
import { fromJS } from 'immutable';
import uniq from 'lodash/uniq';
import { hexToRgba } from 'utils/colors';

export const UPDATE_MAP_STYLE = 'UPDATE_MAP_STYLE';

const updateGLLayer = (style, glLayerId, refLayer) => {
  const currentStyle = style.toJS();
  const currentStyleLayers = currentStyle.layers;
  let newStyle = style;

  const glLayerIndex = currentStyleLayers.findIndex(l => l.id === glLayerId);
  const glLayer = currentStyleLayers.find(l => l.id === glLayerId);

  // visibility
  // TODO make sure no gfw:carto-instanciated check is needed
  const visibility = (refLayer.visible === true && refLayer.added === true) ? 'visible' : 'none';
  newStyle = newStyle.setIn(['layers', glLayerIndex, 'layout', 'visibility'], visibility);

  if (refLayer.basemap === true) {
    return newStyle;
  }

  // color/opacity
  const fillColor = hexToRgba(refLayer.color, 0.5);
  switch (glLayer.type) {
    case 'fill': {
      const previousFill = glLayer.paint['fill-color'];
      const hasFill = previousFill !== undefined && previousFill !== NO_FILL_FILL;
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'fill-opacity'], refLayer.opacity)
        .setIn(['layers', glLayerIndex, 'paint', 'fill-outline-color'], refLayer.color)
        .setIn(['layers', glLayerIndex, 'paint', 'fill-color'], (hasFill) ? fillColor : NO_FILL_FILL);
      break;
    }
    case 'symbol': {
      // TODO use metadata to set is label, or just use 'symbol' ?
      // if (glLayer.isLabelsLayer === true) {
      const labelsVisibility = (visibility === 'visible' && refLayer.showLabels === true) ? 'visible' : 'none';
      newStyle = newStyle.setIn(['layers', glLayerIndex, 'layout', 'visibility'], labelsVisibility);
      if (refLayer.showLabels !== true) {
        break;
      }
      // }
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'text-opacity'], refLayer.opacity)
        .setIn(['layers', glLayerIndex, 'paint', 'text-color'], refLayer.color);
      break;
    }
    default: {
      break;
    }
  }

  return newStyle;
};

export const initCustomLayer = (style, layer, layerData) => {
  // TODO auto set to interactive
  let newStyle = style;
  const currentStyle = style.toJS();
  const sourceId = `${layer.id}-source`;

  if (currentStyle.sources[layer.id] === undefined) {
    const source = fromJS({
      type: 'geojson',
      data: layerData
    });
    newStyle = newStyle.setIn(['sources', sourceId], source);
  }

  if (currentStyle.layers.find(glLayer => glLayer.id === layer.id) === undefined) {
    const glLayer = fromJS({
      id: layer.id,
      // FIXME detect feature type to allow displaying points/lines too?
      type: 'fill',
      source: sourceId,
      layout: {},
      paint: {
      }
    });
    newStyle = newStyle.set('layers', newStyle.get('layers').concat([glLayer]));
  }

  return newStyle;
};

export const instanciateCartoLayer = sourceId => (dispatch, getState) => {
  let style = getState().mapStyle.mapStyle;
  const currentStyle = style.toJS();
  const glSource = currentStyle.sources[sourceId];
  const sql = glSource.metadata['gfw:carto-sql'];

  const mapConfig = { layers: [{ id: sourceId, options: { sql } }] };
  const mapConfigURL = encodeURIComponent(JSON.stringify(mapConfig));
  const cartoAnonymousMapUrl = STATIC_LAYERS_CARTO_ENDPOINT.replace('$MAPCONFIG', mapConfigURL);

  fetch(cartoAnonymousMapUrl)
    .then(res => res.json())
    .then((data) => {
      const layergroupid = data.layergroupid;
      const tilesURL = STATIC_LAYERS_CARTO_TILES_ENDPOINT.replace('$LAYERGROUPID', layergroupid);

      // replace gl source with a new source that use tiles provided by Carto anonymous maps API
      const newSourceId = `${sourceId}-instanciated`;
      style = style.setIn(['sources', newSourceId], fromJS({
        type: 'vector',
        tiles: [tilesURL],
        metadata: { 'gfw:carto-instanciated': true }
      }));
      style.removeIn(['sources', sourceId]);

      // change source in all layers that are using it
      currentStyle.layers.forEach((layer, styleLayerIndex) => {
        if (layer.source === sourceId) {
          style = style.setIn(['layers', styleLayerIndex, 'source'], newSourceId);
          style = style.setIn(['layers', styleLayerIndex, 'metadata', 'gfw:id'], sourceId);
        }
      });
      dispatch({
        type: UPDATE_MAP_STYLE,
        payload: style
      });
      dispatch(updateMapStyle());
    }).catch((err) => {
      console.warn(err);
    });
};

export const updateMapStyle = () => (dispatch, getState) => {
  const staticAndCustomLayers = getState().layers.workspaceLayers.filter(layer => LAYER_TYPES_MAPBOX_GL.indexOf(layer.type) > -1)
  const basemapLayers = getState().basemap.basemapLayers;
  const layers = staticAndCustomLayers.concat(basemapLayers);

  let style = getState().mapStyle.mapStyle;
  const currentStyle = style.toJS();
  const glLayers = currentStyle.layers;

  const cartoLayersToInstanciate = [];

  for (let i = 0; i < glLayers.length; i++) {
    const glLayer = glLayers[i];
    const glSource = currentStyle.sources[glLayer.source];
    const layerId = (glLayer.metadata !== undefined && glLayer.metadata['gfw:id']) || glLayer.source;

    const refLayer = layers.find(l => l.id === layerId);

    if (refLayer === undefined) {
      if (glLayer.type !== 'background') {
        console.warn('gl layer does not exists in workspace', glLayer);
      }
      continue;
    }

    // check if layer is served from Carto, which means we need to instanciate it first
    if (glSource.metadata && glSource.metadata['gfw:carto-sql']) {
      // only if layer is visible and has not been instanciated yet
      if (refLayer.visible === true && glSource.metadata['gfw:carto-instanciated'] !== true) {
        cartoLayersToInstanciate.push(glLayer.source);
        continue;
      }
    }

    style = updateGLLayer(style, glLayer.id, refLayer);
  }

  uniq(cartoLayersToInstanciate).forEach((sourceId) => {
    dispatch(instanciateCartoLayer(sourceId));
  });

  dispatch({
    type: UPDATE_MAP_STYLE,
    payload: style
  });
};
