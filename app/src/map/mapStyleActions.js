import { fromJS } from 'immutable';
import { LAYER_TYPES } from 'constants';

export const SET_BASEMAP = 'SET_BASEMAP';
export const UPDATE_MAP_STYLE = 'UPDATE_MAP_STYLE';

const WORKSPACE_IDS_MAPBOX_STYLE_MATCHES = {
  mparu: ['mpa', 'mpa labels']
};

export const setBasemap = (basemap) => {
  return {
    type: SET_BASEMAP,
    payload: basemap
  };
};

const updateLayer = (style, layer) => {
  const matchedStyleLayers = WORKSPACE_IDS_MAPBOX_STYLE_MATCHES[layer.id];
  const styleLayers = style.toJS().layers;
  let newStyle = style;
  matchedStyleLayers.forEach((layerId) => {
    const styleLayerIndex = styleLayers.findIndex(l => l.id === layerId);
    const styleLayer = styleLayers.find(l => l.id === layerId);

    // visibility
    const visibility = (layer.visible === true && layer.added === true) ? 'visible' : 'none';
    newStyle = newStyle.setIn(['layers', styleLayerIndex, 'layout', 'visibility'], visibility);

    // color/opacity
    // const paintColor = `hsla(${layer.hue}, 90%, 60%, ${layer.opacity})`;
    const paintColor = `hsla(${layer.hue}, 90%, 60%, 0.4)`;
    const paintColor2 = `hsla(${layer.hue}, 90%, 60%, 1)`;
    switch (styleLayer.type) {
      case 'fill': {
        newStyle = newStyle
          .setIn(['layers', styleLayerIndex, 'paint', 'fill-color'], paintColor)
          .setIn(['layers', styleLayerIndex, 'paint', 'fill-outline-color'], paintColor2);
        break;
      }
      case 'symbol': {
        newStyle = newStyle
          .setIn(['layers', styleLayerIndex, 'paint', 'text-color'], paintColor2);
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
    console.log(layers);
    let style = getState().mapStyle.mapStyle;
    layers.forEach((layer) => {
      if (WORKSPACE_IDS_MAPBOX_STYLE_MATCHES[layer.id] === undefined) {
        // console.warn('Layer not found in Mapbox JSON style', layer);
      } else {
        style = updateLayer(style, layer);
      }
    });
    console.log(style.toJS())
    dispatch({
      type: UPDATE_MAP_STYLE,
      payload: style
    });
  };
};

