import { LAYER_TYPES } from 'constants';
import { POLYGON_LAYERS } from 'config';

export const SET_BASEMAP = 'SET_BASEMAP';
export const UPDATE_MAP_STYLE = 'UPDATE_MAP_STYLE';

export const setBasemap = (basemap) => {
  return {
    type: SET_BASEMAP,
    payload: basemap
  };
};

const updateLayer = (style, layer) => {
  const matchedStyleLayers = POLYGON_LAYERS[layer.id].glLayers;
  const styleLayers = style.toJS().layers;
  let newStyle = style;
  matchedStyleLayers.forEach((glLayer) => {
    const styleLayerIndex = styleLayers.findIndex(l => l.id === glLayer.id);
    const styleLayer = styleLayers.find(l => l.id === glLayer.id);

    // visibility
    const visibility = (layer.visible === true && layer.added === true) ? 'visible' : 'none';
    newStyle = newStyle.setIn(['layers', styleLayerIndex, 'layout', 'visibility'], visibility);

    // color/opacity
    const paintColor = `hsla(${layer.hue}, 90%, 60%, ${layer.opacity - 0.5})`;
    const paintColorOutline = `hsla(${layer.hue}, 90%, 60%, ${layer.opacity})`;
    switch (styleLayer.type) {
      case 'fill': {
        newStyle = newStyle
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

export const updateMapStyle = () => {
  return (dispatch, getState) => {
    const layers = getState().layers.workspaceLayers.filter(layer => layer.type === LAYER_TYPES.CartoDBAnimation);
    let style = getState().mapStyle.mapStyle;
    layers.forEach((layer) => {
      if (POLYGON_LAYERS[layer.id] === undefined) {
        // console.warn('Layer not found in Mapbox JSON style', layer);
      } else {
        style = updateLayer(style, layer);
      }
    });
    dispatch({
      type: UPDATE_MAP_STYLE,
      payload: style
    });
  };
};

