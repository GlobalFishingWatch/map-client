import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS,
  CUSTOM_LAYER_UPLOAD_ERROR
} from 'layers/customLayerActions';

const initialState = {
  status: 'idle',
  error: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CUSTOM_LAYER_UPLOAD_START:
      return Object.assign({}, state, { status: action.payload });
    case CUSTOM_LAYER_UPLOAD_SUCCESS:
      return Object.assign({}, state, { status: action.payload });
    case CUSTOM_LAYER_UPLOAD_ERROR:
      return Object.assign({}, state, { error: action.payload, status: action.status });
    default:
      return state;
  }
}
