import { LAYER_TYPES, LAYER_TYPES_MAPBOX_GL } from 'constants';
import { POLYGON_LAYERS } from 'config';
import {fromJS} from "immutable"

export const SET_BASEMAP = 'SET_BASEMAP';
export const UPDATE_MAP_STYLE = 'UPDATE_MAP_STYLE';

export const setBasemap = (basemap) => {
  return {
    type: SET_BASEMAP,
    payload: basemap
  };
};

const updatePolygonLayer = (style, layer) => {
  const matchedStyleLayers = (layer.type === LAYER_TYPES.Custom)
    ? [layer]
    : POLYGON_LAYERS[layer.id].glLayers;

  const styleLayers = style.toJS().layers;
  let newStyle = style;
  matchedStyleLayers.forEach((glLayer) => {
    const styleLayerIndex = styleLayers.findIndex(l => l.id === glLayer.id);
    const styleLayer = styleLayers.find(l => l.id === glLayer.id);

    // visibility
    const visibility = (layer.visible === true && layer.added === true) ? 'visible' : 'none';
    newStyle = newStyle.setIn(['layers', styleLayerIndex, 'layout', 'visibility'], visibility);

    // interactive
    const interactive = (layer.type === LAYER_TYPES.Custom) ? true : glLayer.interactive;
    newStyle = newStyle.setIn(['layers', styleLayerIndex, 'interactive'], interactive);

    // color/opacity
    const paintColor = `hsla(${layer.hue}, 90%, 60%, ${layer.opacity - 0.5})`;
    const paintColorOutline = `hsla(${layer.hue}, 90%, 60%, ${layer.opacity})`;
    switch (styleLayer.type) {
      case 'fill': {
        newStyle = newStyle
          // fill-opacity ?
          .setIn(['layers', styleLayerIndex, 'paint', 'fill-color'], paintColor)
          .setIn(['layers', styleLayerIndex, 'paint', 'fill-outline-color'], paintColorOutline);
        break;
      }
      case 'symbol': {
        newStyle = newStyle
          .setIn(['layers', styleLayerIndex, 'paint', 'text-color'], paintColorOutline);
        break;
      }
      default: {
        break;
      }
    }
  });

  return newStyle;
};

export const initCustomLayer = (style, layer, layerData) => {
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

export const updateMapStyle = () => {
  return (dispatch, getState) => {
    const layers = getState().layers.workspaceLayers.filter(layer => LAYER_TYPES_MAPBOX_GL.indexOf(layer.type) > -1);
    let style = getState().mapStyle.mapStyle;
    layers.forEach((layer) => {
      if (layer.type === LAYER_TYPES.Custom) {
        const layerData = getState().customLayer.layersData[layer.id];
        if (layerData !== undefined) {
          style = initCustomLayer(style, layer, layerData);
        }
      }
      if (layer.type === LAYER_TYPES.CartoDBAnimation && POLYGON_LAYERS[layer.id] === undefined) {
        console.warn('Layer not found in Mapbox GL JSON style', layer);
      } else {
        style = updatePolygonLayer(style, layer);
      }
    });
    dispatch({
      type: UPDATE_MAP_STYLE,
      payload: style
    });
  };
};

