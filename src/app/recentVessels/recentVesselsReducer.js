import {
  LOAD_RECENT_VESSEL_LIST,
  SET_RECENT_VESSEL_HISTORY,
  SET_RECENT_VESSELS_VISIBILITY,
} from 'app/recentVessels/recentVesselsActions'

const initialState = {
  history: [],
  recentVesselModal: {
    open: false,
  },
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_RECENT_VESSEL_HISTORY: {
      const { id, label, tilesetId } = action.payload

      let vesselInHistoryIndex = -1
      let vesselInHistory = {}

      if (state.history.length > 0) {
        vesselInHistoryIndex = state.history.findIndex((vessel) => vessel.id === id)
        vesselInHistory = state.history[vesselInHistoryIndex]
      }

      const newVessel = Object.assign({}, vesselInHistory, {
        label: label || vesselInHistory.label,
        id: id || vesselInHistory.id,
        tilesetId: tilesetId || vesselInHistory.tilesetId,
        timestamp: new Date(),
      })

      let newHistory

      if (vesselInHistoryIndex !== -1) {
        newHistory = [
          newVessel,
          ...state.history.slice(0, vesselInHistoryIndex),
          ...state.history.slice(vesselInHistoryIndex + 1),
        ]
      } else {
        newHistory = [newVessel, ...state.history]
      }

      try {
        const serializedState = JSON.stringify(newHistory)
        localStorage.setItem('vessel_history', serializedState)
      } catch (err) {
        console.warn('Could not save vessel history to local storage')
      }

      return Object.assign({}, state, {
        history: newHistory,
      })
    }

    case LOAD_RECENT_VESSEL_LIST: {
      try {
        const serializedState = localStorage.getItem('vessel_history')

        if (serializedState === null) {
          return state
        }

        const history = JSON.parse(serializedState)
        history.forEach((vessel) => {
          // previously saved vessels to localStorage might still have a legacy seriesgroup identifier
          vessel.id = vessel.id || vessel.seriesgroup
        })

        return Object.assign({}, state, {
          history: JSON.parse(serializedState),
        })
      } catch (err) {
        return state
      }
    }

    case SET_RECENT_VESSELS_VISIBILITY: {
      const newState = Object.assign({}, state)
      newState.recentVesselModal = {
        open: action.payload,
      }

      return newState
    }
    default:
      return state
  }
}
