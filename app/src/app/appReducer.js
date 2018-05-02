import {
  SET_IS_EMBEDDED,
  SET_LAYER_INFO_MODAL,
  SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
  SET_LOADERS,
  SET_LOADING
} from './appActions';

const initialState = {
  isEmbedded: false,
  loading: false,
  loaders: {},
  layerModal: {
    open: false,
    info: {}
  },
  supportModal: {
    open: false
  },
  layerManagementModal: {
    open: false
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_IS_EMBEDDED:
      return Object.assign({}, state, { isEmbedded: action.payload });
    case SET_LOADING:
      return Object.assign({}, state, { loading: action.payload });
    case SET_LOADERS:
      return Object.assign({}, state, { loaders: action.payload });
    case SET_LAYER_INFO_MODAL: {
      const newState = Object.assign({}, state);
      newState.layerModal = {
        open: action.payload.open,
        info: action.payload.info
      };
      return newState;
    }
    case SET_LAYER_MANAGEMENT_MODAL_VISIBILITY: {
      const newState = Object.assign({}, state);
      newState.layerManagementModal = {
        open: action.payload
      };

      return newState;
    }
    default:
      return state;
  }
}
