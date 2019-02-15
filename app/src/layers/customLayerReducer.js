import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS,
  CUSTOM_LAYER_UPLOAD_ERROR,
  CUSTOM_LAYER_RESET
} from 'layers/customLayerActions';

const initialState = {
  status: 'idle',
  error: null,
  previewLayer: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CUSTOM_LAYER_UPLOAD_START:
      return Object.assign({}, state, { error: null, status: 'pending', previewLayer: null });
    case CUSTOM_LAYER_UPLOAD_SUCCESS:
      return Object.assign({}, state, { error: null, status: 'preview', previewLayer: action.payload });
    case CUSTOM_LAYER_UPLOAD_ERROR:
      return Object.assign({}, state, { error: action.payload.error, status: 'idle' });
    case CUSTOM_LAYER_RESET:
      return Object.assign({}, state, { error: null, status: 'idle', previewLayer: {} });
    default:
      return state;
  }
}
