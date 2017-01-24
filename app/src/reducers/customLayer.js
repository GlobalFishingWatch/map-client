import {
  CUSTOM_LAYER_UPLOAD_START,
  CUSTOM_LAYER_UPLOAD_SUCCESS
} from 'actions';

const initialState = {
  status: 'idle'
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CUSTOM_LAYER_UPLOAD_START:
      return Object.assign({}, state, { status: action.payload });
    case CUSTOM_LAYER_UPLOAD_SUCCESS:
      return Object.assign({}, state, { status: action.payload });
    default:
      return state;
  }
}
