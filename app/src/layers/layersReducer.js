import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import {
  ADD_CUSTOM_LAYER,
  SET_LAYER_HEADER,
  SET_LAYER_TINT,
  SET_LAYER_OPACITY,
  SET_LAYERS,
  SET_WORKSPACE_LAYER_LABEL,
  SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE,
  TOGGLE_LAYER_PANEL_EDIT_MODE,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  TOGGLE_LAYER_SHOW_LABELS
} from 'layers/layersActions';
import { LAYER_TYPES } from 'constants';

const getUpdatedLayers = (state, action, changedLayerCallback) => {
  const layers = cloneDeep(state.workspaceLayers);
  const layerIndex = layers.findIndex(l => l.id === action.payload.layerId);
  const changedLayer = layers[layerIndex];

  if (layerIndex > -1) {
    changedLayerCallback(changedLayer);
  }
  return layers;
};

const getReportableInfo = layers => ({
  hasNonReportableLayers: layers.some(layer => layer.type === LAYER_TYPES.Heatmap &&
    layer.visible === true &&
    layer.header.reports === undefined
  ),
  reportableLayersNames: layers.filter(layer => layer.type === LAYER_TYPES.Heatmap &&
    layer.visible === true &&
    layer.header.reports !== undefined).map(layer => layer.title)
});


const initialState = {
  workspaceLayers: [],
  layerPanelEditMode: false,
  layerIdPromptedForRemoval: false,
  reportableInfo: {
    hasNonReportableLayers: true,
    reportableLayersNames: []
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE:
      return Object.assign({}, state, { layerIdPromptedForRemoval: action.payload });
    case SET_LAYERS:
      return Object.assign({}, state, { workspaceLayers: action.payload.concat(), reportableInfo: getReportableInfo(action.payload) });
    case SET_LAYER_HEADER: {
      const layerIndex = state.workspaceLayers.findIndex(layer => layer.id === action.payload.layerId);
      const layer = cloneDeep(state.workspaceLayers[layerIndex]);
      layer.header = action.payload.header;
      return Object.assign({}, state, {
        workspaceLayers: [...state.workspaceLayers.slice(0, layerIndex), layer, ...state.workspaceLayers.slice(layerIndex + 1)]
      });
    }
    case TOGGLE_LAYER_VISIBILITY: {
      const workspaceLayers = getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.visible = action.payload.visibility;
      });
      return Object.assign({}, state, { workspaceLayers, reportableInfo: getReportableInfo(workspaceLayers) });
    }
    case TOGGLE_LAYER_WORKSPACE_PRESENCE: {
      const workspaceLayers = getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.added = action.payload.added;
      });
      return Object.assign({}, state, {
        workspaceLayers,
        layerPanelEditMode: state.layerPanelEditMode && workspaceLayers.filter(e => e.added === true).length > 0
      });
    }
    case SET_LAYER_OPACITY: {
      const workspaceLayers = getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.opacity = action.payload.opacity;
      });
      return Object.assign({}, state, { workspaceLayers });
    }
    case SET_LAYER_TINT: {
      const workspaceLayers = getUpdatedLayers(state, action, (changedLayer) => {
        if (changedLayer.type === LAYER_TYPES.Heatmap) {
          changedLayer.hue = action.payload.hue;
        } else {
          changedLayer.color = action.payload.color;
        }
      });
      return Object.assign({}, state, { workspaceLayers });
    }
    case TOGGLE_LAYER_SHOW_LABELS: {
      const workspaceLayers = getUpdatedLayers(state, action, (changedLayer) => {
        changedLayer.showLabels = (changedLayer.showLabels === undefined || changedLayer.showLabels === false);
      });
      return Object.assign({}, state, { workspaceLayers });
    }
    case ADD_CUSTOM_LAYER: {
      const heatmapLayerPosition = findIndex(state.workspaceLayers, layer => layer.type === LAYER_TYPES.Heatmap);

      const newLayer = {
        id: action.payload.id,
        url: action.payload.url,
        title: action.payload.name,
        label: action.payload.name,
        description: action.payload.description,
        type: LAYER_TYPES.Custom,
        visible: true,
        opacity: 1,
        added: true
      };

      return Object.assign({}, state, {
        workspaceLayers: [
          ...state.workspaceLayers.slice(0, heatmapLayerPosition),
          newLayer,
          ...state.workspaceLayers.slice(heatmapLayerPosition)
        ]
      });
    }
    case TOGGLE_LAYER_PANEL_EDIT_MODE: {
      const newState = Object.assign({}, state, {
        layerPanelEditMode: action.payload.forceMode === null ? !state.layerPanelEditMode : action.payload.forceMode
      });

      if (newState.layerPanelEditMode === false) {
        newState.workspaceLayers = cloneDeep(state.workspaceLayers);


        newState.workspaceLayers.forEach((layer) => {
          if (!layer.label || /^\s*$/.test(layer.label)) {
            layer.label = layer.title;
          }
        });
      }

      return newState;
    }
    case SET_WORKSPACE_LAYER_LABEL: {
      const layerIndex = state.workspaceLayers.findIndex(layer => layer.id === action.payload.layerId);
      const newLayer = cloneDeep(state.workspaceLayers[layerIndex]);
      newLayer.label = action.payload.label;

      return Object.assign({}, state, {
        workspaceLayers: [...state.workspaceLayers.slice(0, layerIndex), newLayer, ...state.workspaceLayers.slice(layerIndex + 1)]
      });
    }
    default:
      return state;
  }
}
