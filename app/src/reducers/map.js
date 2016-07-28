const initialState = {
  loading: false,
  layers: [],
  zoom: 3,
  center: [0, 0],
  vessel: null
};
import {VESSEL_INIT, SHOW_LOADING, TOGGLE_LAYER_VISIBILITY, SET_LAYERS, SET_ZOOM, SET_CENTER} from "../constants";

export default function (state = initialState, action) {
  switch (action.type) {
    case VESSEL_INIT:
      return Object.assign({}, state, action.payload);
    case SHOW_LOADING:
      return Object.assign({}, state, {loading: action.payload.data});
    case SET_LAYERS:
      return Object.assign({}, state, {layers: action.payload});
    case SET_ZOOM:
      return Object.assign({}, state, { zoom: action.payload });
    case SET_CENTER:
      return Object.assign({}, state, { center: action.payload });
    case TOGGLE_LAYER_VISIBILITY:
      const layers = state.layers.slice(0);
      for (let i = 0, length = layers.length; i < length; i++) {
        if (layers[i].title === action.payload.title) {
          action.payload.visible = !action.payload.visible
          layers[i] = action.payload;
          break;
        }
      }
      return Object.assign({}, state, {layers});
    default:
      return state;
  }
};
