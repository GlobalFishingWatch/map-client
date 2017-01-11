import _ from 'lodash';
import { LAYER_TYPES } from 'constants';
import {
  SET_LAYERS,
  TOGGLE_LAYER_VISIBILITY,
  SET_LAYER_OPACITY,
  SET_LAYER_HUE
} from 'actions';
import { updateFlagFilters } from 'actions/filters';

export function initLayers(workspaceLayers, libraryLayers) {
  return (dispatch) => {
    const workspaceLayersIds = [];

    // Get all ids coming from workspace
    workspaceLayers.forEach((l) => {
      if (l.id === undefined) return;
      workspaceLayersIds.push(l.id);
    });

    // formats layer object to keep a consistent format around the app
    libraryLayers.forEach((l) => {
      // moves "args" content to the root of the object
      Object.assign(l, l.args);
      // removes "args" property from the object
      /* eslint no-param-reassign: 0 */
      delete l.args;
    });


    // Match workspace ids with library ones
    const matchedLayers = _.filter(libraryLayers, (l) => workspaceLayersIds.indexOf(l.id) !== -1);

    matchedLayers.forEach((l) => {
      const localLayer = _.find(workspaceLayers, (wl) => wl.id === l.id);

      // overwrites API values with workspace ones
      Object.assign(l, localLayer);
    });

    const layers = matchedLayers
      .filter(l => _.values(LAYER_TYPES).indexOf(l.type) !== -1);

    // parses opacity attribute
    layers.forEach(layer => {
      const l = layer;
      if (!!layer.opacity) {
        l.opacity = parseFloat(layer.opacity);
      } else {
        l.opacity = 1;
      }
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
