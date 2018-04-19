import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS,
  CUSTOM_LAYER_UPLOAD_ERROR,
  SET_CUSTOM_LAYER_DATA
} from 'layers/customLayerActions';

const initialState = {
  status: 'idle',
  error: null,
  layersData: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CUSTOM_LAYER_UPLOAD_START:
      return Object.assign({}, state, { status: action.payload });
    case CUSTOM_LAYER_UPLOAD_SUCCESS:
      return Object.assign({}, state, { status: action.payload });
    case CUSTOM_LAYER_UPLOAD_ERROR:
      return Object.assign({}, state, { error: action.payload, status: action.status });
    case SET_CUSTOM_LAYER_DATA: {
      const layersData = { ...state.layersData };
      layersData[action.payload.id] = action.payload.data;
      return { ...state, layersData };
    }
    default:
      return state;
  }
}
