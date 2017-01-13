import _ from 'lodash';
import { LAYER_TYPES } from 'constants';
import {
  SET_LAYERS,
  TOGGLE_LAYER_VISIBILITY,
  SET_LAYER_OPACITY,
  SET_LAYER_HUE,
  SET_TILESET_URL
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
    libraryLayers.forEach(layer => {
      // moves "args" content to the root of the object
      Object.assign(layer, layer.args);
      // removes "args" property from the object
      /* eslint no-param-reassign: 0 */
      delete layer.args;
    });


    // Match workspace ids with library ones
    const matchedLayers = _.filter(libraryLayers, layer => workspaceLayersIds.indexOf(layer.id) !== -1);

    matchedLayers.forEach(layer => {
      const localLayer = _.find(workspaceLayers, workspaceLayer => workspaceLayer.id === layer.id);

      if (!localLayer) return;

      // overwrites API values with workspace ones
      Object.assign(layer, localLayer);
    });

    const layers = matchedLayers
      .filter(layer => _.values(LAYER_TYPES).indexOf(layer.type) !== -1);

    // parses opacity attribute
    layers.forEach(layer => {
      const l = layer;
      if (!!layer.opacity) {
        l.opacity = parseFloat(layer.opacity);
      } else {
        l.opacity = 1;
      }
    });

    const vesselLayer = layers
      .filter(l => l.type === LAYER_TYPES.ClusterAnimation)[0];

    if (vesselLayer !== undefined) {
      const tilesetUrl = vesselLayer.source.args.url;

      // TODO this is only used by vesselInfo, but the data is inside a layer
      // review wit SkyTruth
      dispatch({
        type: SET_TILESET_URL,
        payload: tilesetUrl
      });
    }

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
