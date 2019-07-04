import {
  EDIT_RULER,
  MOVE_CURRENT_RULER,
  TOGGLE_RULERS_EDITING,
  RESET_RULERS,
} from './rulersActions'

const initialState = {
  visible: false,
  editing: false,
  drawing: false,
  rulers: [],
}

const rulersReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_RULER: {
      if (state.editing === false) {
        return state
      }
      if (state.drawing === true) {
        const lastRulerIndex = state.rulers.length - 1
        const updatedRuler = { ...state.rulers[lastRulerIndex] }
        updatedRuler.isNew = false
        const updatedRulers = [...state.rulers.slice(0, -1), updatedRuler]
        return { ...state, drawing: false, visible: true, rulers: updatedRulers }
      }
      const newRuler = {
        start: {
          longitude: action.longitude,
          latitude: action.latitude,
        },
        end: {
          longitude: action.longitude + 0.0001,
          latitude: action.latitude + 0.0001,
        },
        isNew: true,
      }
      const newRulers = [...state.rulers, newRuler]
      return { ...state, rulers: newRulers, drawing: true, visible: true }
    }

    case MOVE_CURRENT_RULER: {
      if (state.drawing === false || state.editing === false || state.rulers.length === 0) {
        return state
      }
      const lastRulerIndex = state.rulers.length - 1
      const updatedRuler = { ...state.rulers[lastRulerIndex] }
      updatedRuler.end.longitude = action.longitude
      updatedRuler.end.latitude = action.latitude
      const newRulers = [...state.rulers.slice(0, -1), updatedRuler]
      return { ...state, rulers: newRulers }
    }

    case TOGGLE_RULERS_EDITING: {
      return {
        ...state,
        editing: !state.editing,
      }
    }

    case RESET_RULERS: {
      return {
        ...state,
        visible: false,
        drawing: false,
        rulers: [],
      }
    }

    default:
      return state
  }
}

export default rulersReducer
