import { INFO_STATUS } from 'app/constants'
import {
  LOAD_ENCOUNTERS_INFO,
  SET_ENCOUNTERS_INFO,
  SET_ENCOUNTERS_VESSEL_INFO,
  CLEAR_ENCOUNTERS_INFO,
} from 'app/encounters/encountersActions'

const initialState = {
  id: null,
  tilesetId: null,
  encountersInfo: null,
  infoPanelStatus: INFO_STATUS.HIDDEN,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.LOADING,
        id: action.payload.id,
        tilesetId: action.payload.tilesetId,
      })
    }

    case SET_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.LOADED,
        encountersInfo: Object.assign({}, action.payload.encounterInfo, action.payload.encounter),
      })
    }

    case SET_ENCOUNTERS_VESSEL_INFO: {
      const newEncountersInfo = Object.assign({}, state.encountersInfo)
      const newVesselIndex = state.encountersInfo.vessels.findIndex(
        (vessel) => vessel.id === action.payload.id
      )
      const newVessel = Object.assign({}, newEncountersInfo.vessels[newVesselIndex])
      newVessel.info = action.payload.vesselInfo
      newVessel.fields = action.payload.fields
      newEncountersInfo.vessels[newVesselIndex] = newVessel
      return Object.assign({}, state, {
        encountersInfo: newEncountersInfo,
      })
    }

    case CLEAR_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.HIDDEN,
        encountersInfo: null,
        id: null,
      })
    }

    default:
      return state
  }
}
