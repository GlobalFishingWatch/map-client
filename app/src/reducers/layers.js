import _ from 'lodash';

import {
  SET_LAYERS,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  SET_LAYER_OPACITY,
  SET_LAYER_HUE
} from 'actions';

const getUpdatedLayers = (state, action, changedLayerCallback) => {
  const layers = _.cloneDeep(state);
  const layerIndex = layers.findIndex(l => l.id === action.payload.layerId);
  const changedLayer = layers[layerIndex];

  if (layerIndex > -1) {
    changedLayerCallback(changedLayer);
  }
  return layers;
};

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LAYERS:
      return action.payload.concat();
    case TOGGLE_LAYER_VISIBILITY: {
      /* eslint no-param-reassign: 0 */
      const layers = getUpdatedLayers(state, action, changedLayer => {
        changedLayer.visible = (action.payload.forceStatus !== null) ? action.payload.forceStatus : !changedLayer.visible;
      });
      return layers;
    }
    case TOGGLE_LAYER_WORKSPACE_PRESENCE: {
      /* eslint no-param-reassign: 0 */
      const layers = getUpdatedLayers(state, action, changedLayer => {
        changedLayer.added = (action.payload.forceStatus !== null) ? action.payload.forceStatus : !changedLayer.added;
      });
      return layers;
    }
    case SET_LAYER_OPACITY: {
      /* eslint no-param-reassign: 0 */
      const layers = getUpdatedLayers(state, action, changedLayer => {
        changedLayer.opacity = action.payload.opacity;
      });
      return layers;
    }
    case SET_LAYER_HUE: {
      /* eslint no-param-reassign: 0 */
      const layers = getUpdatedLayers(state, action, changedLayer => {
        changedLayer.hue = action.payload.hue;
      });
      return layers;
    }

    default:
      return state;
  }
}
