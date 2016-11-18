import {
  VESSEL_INIT,
  SHOW_LOADING,
  TOGGLE_LAYER_VISIBILITY,
  SET_LAYERS,
  SET_LAYER_OPACITY,
  SET_ZOOM,
  SET_CENTER,
  SHARE_MODAL_OPEN,
  SET_WORKSPACE_ID,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  UPDATE_VESSEL_TRANSPARENCY,
  UPDATE_VESSEL_COLOR,
  CHANGE_VESSEL_TRACK_DISPLAY_MODE
} from '../actions';
import _ from 'lodash';
import { DEFAULT_VESSEL_COLOR, BASEMAP_TYPES } from '../constants';

const initialState = {
  loading: false,
  layers: [{
    title: 'satellite',
    source: {
      type: 'BinFormat',
      args: {
        url: ''
      }
    },
    visible: true,
    type: 'CartoDBBasemap'
  }],
  zoom: 3,
  center: [0, 0],
  shareModal: {
    open: false,
    error: null
  },
  workspaceId: null,
  vesselTransparency: 5,
  vesselColor: DEFAULT_VESSEL_COLOR,
  vesselTrackDisplayMode: 'current'
};

/**
 * Map reducer
 *
 * @export Map reducer
 * @param {object} [state=initialState]
 * @param {object} action
 * @returns {object}
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case VESSEL_INIT:
      return Object.assign({}, state, action.payload);
    case SHOW_LOADING:
      return Object.assign({}, state, { loading: action.payload.data });
    case SET_LAYERS: {
      // joins initialState layers with incoming state layers to not lost first ones.
      const layers = state.layers.concat(action.payload);
      return Object.assign({}, state, { layers });
    }
    case SET_ZOOM:
      return Object.assign({}, state, { zoom: action.payload });
    case SET_CENTER:
      return Object.assign({}, state, { center: action.payload });
    case UPDATE_VESSEL_TRANSPARENCY:
      return Object.assign({}, state, { vesselTransparency: action.payload });
    case UPDATE_VESSEL_COLOR:
      return Object.assign({}, state, { vesselColor: action.payload });
    case CHANGE_VESSEL_TRACK_DISPLAY_MODE:
      return Object.assign({}, state, { vesselTrackDisplayMode: action.payload });
    case SET_LAYER_OPACITY: {
      const layerOpacity = action.payload.opacity;
      const layerIndex = state.layers.reduce((res, l, i) => {
        if (l.title === action.payload.layer.title) {
          return i;
        }
        return res;
      }, -1);

      // If the layer couldn't be found, we don't make any change
      if (layerIndex === -1) return state;

      const newLayer = Object.assign({}, state.layers[layerIndex], {
        opacity: layerOpacity
      });

      let newLayers;
      if (layerIndex === 0) {
        if (state.layers.length === 1) {
          newLayers = [newLayer];
        } else {
          newLayers = [newLayer].concat(state.layers.slice(1, state.layers.length));
        }
      } else if (layerIndex === state.layers.length - 1) {
        newLayers = state.layers.slice(0, state.layers.length - 1).concat([newLayer]);
      } else {
        newLayers = state.layers.slice(0, layerIndex).concat([newLayer],
          state.layers.slice(layerIndex + 1, state.layers.length));
      }

      return Object.assign({}, state, { layers: newLayers });
    }
    case TOGGLE_LAYER_VISIBILITY: {
      const layers = _.cloneDeep(state.layers);
      const toggledLayerIndex = layers.findIndex(l => l.title === action.payload.title);
      const newLayer = layers[toggledLayerIndex];

      if (toggledLayerIndex === -1) return state;

      if (BASEMAP_TYPES.indexOf(newLayer.type) !== -1) {
        layers.forEach((l) => {
          const layer = l;
          // it's not a basemap
          if (BASEMAP_TYPES.indexOf(layer.type) === -1) return;

          layer.visible = layer.title === newLayer.title;
        });
      } else {
        newLayer.visible = !newLayer.visible;
      }

      return Object.assign({}, state, { layers });
    }

    case SHARE_MODAL_OPEN: {
      const newState = Object.assign({}, state);
      newState.shareModal.open = action.payload;
      return newState;
    }

    case SET_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: action.payload });

    case DELETE_WORKSPACE_ID:
      return Object.assign({}, state, { workspaceId: null });

    case SET_SHARE_MODAL_ERROR: {
      const newState = Object.assign({}, state);
      newState.shareModal.error = action.payload;
      return newState;
    }

    default:
      return state;
  }
}
