import _ from 'lodash';
import {
  SET_LAYERS,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  SET_LAYER_OPACITY,
  SET_LAYER_HUE,
  ADD_CUSTOM_LAYER
} from 'actions';
import { LAYER_TYPES } from 'constants';

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
      return getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.visible = (action.payload.forceStatus !== null) ? action.payload.forceStatus : !changedLayer.visible;
      });
    }
    case TOGGLE_LAYER_WORKSPACE_PRESENCE: {
      return getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.added = (action.payload.forceStatus !== null) ? action.payload.forceStatus : !changedLayer.added;
      });
    }
    case SET_LAYER_OPACITY: {
      return getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.opacity = action.payload.opacity;
      });
    }
    case SET_LAYER_HUE: {
      return getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.hue = action.payload.hue;
      });
    }
    case ADD_CUSTOM_LAYER: {
      return [
        ...state,
        {
          id: action.payload.url,
          url: action.payload.url,
          title: action.payload.name,
          description: action.payload.description,
          type: LAYER_TYPES.Custom,
          visible: true,
          opacity: 1,
          added: true
        }
      ];
    }

    default:
      return state;
  }
}
