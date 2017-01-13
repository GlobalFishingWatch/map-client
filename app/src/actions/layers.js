import _ from 'lodash';
import { LAYER_TYPES } from 'constants';
import {
  SET_LAYERS,
  TOGGLE_LAYER_VISIBILITY,
  SET_LAYER_OPACITY,
  SET_LAYER_HUE
} from 'actions';
import { updateFlagFilters } from 'actions/filters';

export function initLayers(layers_) {
  return (dispatch, getState) => {
    const state = getState();

    let layers = layers_
      .filter(l => _.values(LAYER_TYPES).indexOf(l.type) !== -1);

    if (state.user.userPermissions.indexOf('seeVesselsLayers') === -1) {
      layers = layers.filter(l => l.type !== LAYER_TYPES.ClusterAnimation);
    }

    // parses opacity attribute
    layers.forEach(layer => {
      const l = layer;
      if (!!layer.opacity) {
        l.opacity = parseFloat(layer.opacity);
      } else {
        l.opacity = 1;
      }
    });

    // add an id to each layer
    let id = 0;
    layers.forEach(layer => {
      /* eslint no-param-reassign: 0 */
      layer.id = id;
      id++;
    });

    dispatch({
      type: SET_LAYERS,
      payload: layers
    });
  };
}


export function toggleLayerVisibility(layerId, forceShow = false) {
  return {
    type: TOGGLE_LAYER_VISIBILITY,
    payload: {
      layerId,
      forceShow
    }
  };
}

export function setLayerOpacity(opacity, layerId) {
  return {
    type: SET_LAYER_OPACITY,
    payload: {
      layerId,
      opacity
    }
  };
}

export function setLayerHue(hue, layerId) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYER_HUE,
      payload: {
        layerId,
        hue
      }
    });
    // TODO we might want to override all filters hue settings here (see with Dani)
    dispatch(updateFlagFilters());
  };
}
