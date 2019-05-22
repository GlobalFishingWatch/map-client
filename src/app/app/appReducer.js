import {
  SET_IS_EMBEDDED,
  SET_LAYER_INFO_MODAL,
  SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
  SET_LOADING_START,
  SET_LOADING_COMPLETE,
  TOGGLE_MAP_PANELS,
} from './appActions'

const initialState = {
  isEmbedded: false,
  loading: false,
  layerModal: {
    open: false,
    info: {},
  },
  supportModal: {
    open: false,
  },
  layerManagementModal: {
    open: false,
  },
  mapPanelsExpanded: true,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_IS_EMBEDDED:
      return Object.assign({}, state, { isEmbedded: action.payload })
    case SET_LOADING_START:
      return Object.assign({}, state, { loading: true })
    case SET_LOADING_COMPLETE:
      return Object.assign({}, state, { loading: false })
    case SET_LAYER_INFO_MODAL: {
      const newState = Object.assign({}, state)
      newState.layerModal = {
        open: action.payload.open,
        info: action.payload.info,
      }
      return newState
    }
    case SET_LAYER_MANAGEMENT_MODAL_VISIBILITY: {
      const newState = Object.assign({}, state)
      newState.layerManagementModal = {
        open: action.payload,
      }

      return newState
    }
    case TOGGLE_MAP_PANELS: {
      const mapPanelsExpanded = action.payload === null ? !state.mapPanelsExpanded : action.payload
      return { ...state, mapPanelsExpanded }
    }
    default:
      return state
  }
}
