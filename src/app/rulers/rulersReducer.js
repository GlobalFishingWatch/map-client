import { EDIT_RULER, MOVE_CURRENT_RULER } from './rulersActions'

const initialState = {
  visible: true,
  editing: false,
  drawing: false,
  rulers: [
    {
      isNew: true,
      start: {
        longitude: -75.5859375,
        latitude: -55.77657301866769,
      },
      end: {
        longitude: -78.3984375,
        latitude: -47.5172006978394,
      },
    },
  ],
}

const rulersReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_RULER: {
      if (state.drawing === true) {
        const lastRulerIndex = state.rulers.length - 1
        const updatedRuler = { ...state.rulers[lastRulerIndex] }
        updatedRuler.isNew = false
        const updatedRulers = [...state.rulers.slice(0, -1), updatedRuler]
        return { ...state, drawing: false, rulers: updatedRulers }
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
      return { ...state, rulers: newRulers, drawing: true }
    }

    case MOVE_CURRENT_RULER: {
      if (state.drawing === false) {
        return state
      }
      const lastRulerIndex = state.rulers.length - 1
      const updatedRuler = { ...state.rulers[lastRulerIndex] }
      updatedRuler.end.longitude = action.longitude
      updatedRuler.end.latitude = action.latitude
      const newRulers = [...state.rulers.slice(0, -1), updatedRuler]
      return { ...state, rulers: newRulers }
    }

    default:
      return state
  }
}

export default rulersReducer
