import {
  SET_FLEETS,
  TOGGLE_FLEET_VISIBILITY,
  SET_FLEETS_MODAL_VISIBILITY,
  COMMIT_CURRENT_EDITS,
  DELETE_CURRENTLY_EDITED_FLEET,
  DISCARD_CURRENT_EDITS,
  CREATE_FLEET,
  START_EDITING_FLEET,
  TOGGLE_VESSEL_IN_CURRENTLY_EDITED_FLEET,
  SET_CURRENTLY_EDITED_FLEET_COLOR,
  SET_CURRENTLY_EDITED_FLEET_TITLE,
  UPDATE_CURRENTLY_EDITED_DEFAULT_TITLE,
} from 'app/fleets/fleetsActions'

let currentFleetId = 0

const initialState = {
  fleets: [],
  currentlyEditedFleet: null,
  isFleetsModalOpen: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FLEETS: {
      action.payload.forEach((fleet) => {
        fleet.id = currentFleetId++
      })
      return { ...state, fleets: action.payload }
    }
    case TOGGLE_FLEET_VISIBILITY: {
      const fleetIndex = state.fleets.findIndex((f) => f.id === action.payload)
      const fleet = { ...state.fleets[fleetIndex] }
      fleet.visible = !fleet.visible
      const fleets = [
        ...state.fleets.slice(0, fleetIndex),
        fleet,
        ...state.fleets.slice(fleetIndex + 1),
      ]
      return { ...state, fleets }
    }
    case SET_FLEETS_MODAL_VISIBILITY: {
      return { ...state, isFleetsModalOpen: action.payload }
    }
    case COMMIT_CURRENT_EDITS: {
      const fleet = { ...state.currentlyEditedFleet }
      delete fleet.isNew
      const fleetIndex = state.fleets.findIndex((f) => f.id === fleet.id)
      const fleets =
        fleetIndex === -1
          ? [fleet].concat(state.fleets)
          : [...state.fleets.slice(0, fleetIndex), fleet, ...state.fleets.slice(fleetIndex + 1)]
      return { ...state, currentlyEditedFleet: null, fleets }
    }
    case DELETE_CURRENTLY_EDITED_FLEET: {
      const fleetIndex = state.fleets.findIndex((f) => f.id === state.currentlyEditedFleet.id)
      const fleets = [...state.fleets.slice(0, fleetIndex), ...state.fleets.slice(fleetIndex + 1)]
      return { ...state, currentlyEditedFleet: null, fleets }
    }
    case DISCARD_CURRENT_EDITS: {
      return { ...state, currentlyEditedFleet: null }
    }
    case CREATE_FLEET: {
      const fleet = {
        id: currentFleetId++,
        vessels: action.payload.defaultVessels,
        visible: true,
        color: action.payload.defaultColor,
        title: action.payload.defaultTitle,
        defaultTitle: action.payload.defaultTitle,
        isNew: true,
      }
      return { ...state, currentlyEditedFleet: fleet }
    }
    case START_EDITING_FLEET: {
      const currentlyEditedFleet = {
        ...state.fleets.find((f) => f.id === action.payload),
      }
      return { ...state, currentlyEditedFleet }
    }
    case TOGGLE_VESSEL_IN_CURRENTLY_EDITED_FLEET: {
      const currentlyEditedFleet = { ...state.currentlyEditedFleet }
      const vessels = [...currentlyEditedFleet.vessels]
      const vesselInFleetIndex = vessels.indexOf(action.payload)
      if (vesselInFleetIndex === -1) {
        vessels.push(action.payload)
      } else {
        vessels.splice(vesselInFleetIndex, 1)
      }
      currentlyEditedFleet.vessels = vessels
      return { ...state, currentlyEditedFleet }
    }
    case SET_CURRENTLY_EDITED_FLEET_COLOR: {
      const currentlyEditedFleet = { ...state.currentlyEditedFleet }
      currentlyEditedFleet.color = action.payload
      return { ...state, currentlyEditedFleet }
    }
    case SET_CURRENTLY_EDITED_FLEET_TITLE: {
      const currentlyEditedFleet = { ...state.currentlyEditedFleet }
      currentlyEditedFleet.title = action.payload
      return { ...state, currentlyEditedFleet }
    }
    case UPDATE_CURRENTLY_EDITED_DEFAULT_TITLE: {
      const currentlyEditedFleet = { ...state.currentlyEditedFleet }
      currentlyEditedFleet.defaultTitle = action.payload.defaultTitle
      return { ...state, currentlyEditedFleet }
    }
    default:
      return state
  }
}
