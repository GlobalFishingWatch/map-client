import { applyFleetOverrides } from 'app/vesselInfo/vesselInfoActions'

export const SET_FLEETS = 'SET_FLEETS'
export const TOGGLE_FLEET_VISIBILITY = 'TOGGLE_FLEET_VISIBILITY'
export const SET_FLEETS_MODAL_VISIBILITY = 'SET_FLEETS_MODAL_VISIBILITY'
export const COMMIT_CURRENT_EDITS = 'COMMIT_CURRENT_EDITS'
export const DELETE_CURRENTLY_EDITED_FLEET = 'DELETE_CURRENTLY_EDITED_FLEET'
export const DISCARD_CURRENT_EDITS = 'DISCARD_CURRENT_EDITS'
export const CREATE_FLEET = 'CREATE_FLEET'
export const START_EDITING_FLEET = 'START_EDITING_FLEET'
export const TOGGLE_VESSEL_IN_CURRENTLY_EDITED_FLEET = 'TOGGLE_VESSEL_IN_CURRENTLY_EDITED_FLEET'
export const SET_CURRENTLY_EDITED_FLEET_COLOR = 'SET_CURRENTLY_EDITED_FLEET_COLOR'
export const SET_CURRENTLY_EDITED_FLEET_TITLE = 'SET_CURRENTLY_EDITED_FLEET_TITLE'
export const UPDATE_CURRENTLY_EDITED_DEFAULT_TITLE = 'UPDATE_CURRENTLY_EDITED_DEFAULT_TITLE'

export const setFleetsFromWorkspace = (fleets) => ({
  type: SET_FLEETS,
  payload: fleets,
})

export const toggleFleetVisibility = (id) => (dispatch) => {
  dispatch({
    type: TOGGLE_FLEET_VISIBILITY,
    payload: id,
  })
  dispatch(applyFleetOverrides())
}

const setFleetsModalVisibility = (visibility) => ({
  type: SET_FLEETS_MODAL_VISIBILITY,
  payload: visibility,
})

export const commitCurrentEdits = () => (dispatch) => {
  dispatch(setFleetsModalVisibility(false))
  dispatch({
    type: COMMIT_CURRENT_EDITS,
  })
  dispatch(applyFleetOverrides())
}

export const breakApartCurrentlyEditedFleet = () => (dispatch) => {
  dispatch(setFleetsModalVisibility(false))
  dispatch({
    type: DELETE_CURRENTLY_EDITED_FLEET,
  })
}

export const discardCurrentEdits = () => (dispatch) => {
  dispatch(setFleetsModalVisibility(false))
  dispatch({
    type: DISCARD_CURRENT_EDITS,
  })
}

const getDefaultTitle = (fleetVessels, allVessels) =>
  fleetVessels
    .map((seriesgroup) => allVessels.find((v) => v.seriesgroup === seriesgroup).title)
    .join(', ')

const updateCurrentlyEditedDefaultTitle = () => (dispatch, getState) => {
  const vessels = getState().vesselInfo.vessels
  const fleet = getState().fleets.currentlyEditedFleet
  const defaultTitle = getDefaultTitle(fleet.vessels, vessels)

  dispatch({
    type: UPDATE_CURRENTLY_EDITED_DEFAULT_TITLE,
    payload: {
      defaultTitle,
    },
  })
}

export const createFleet = () => (dispatch, getState) => {
  let allVesselsInFleets = []
  const vessels = getState().vesselInfo.vessels.filter((v) => v.pinned === true)
  const fleets = getState().fleets.fleets
  fleets.forEach((f) => {
    allVesselsInFleets = allVesselsInFleets.concat(f.vessels)
  })

  const defaultVessels = vessels.filter((v) => allVesselsInFleets.indexOf(v.seriesgroup) === -1)
  const defaultVesselsSeriesgroups = defaultVessels.map((v) => v.seriesgroup)

  const defaultTitle = getDefaultTitle(defaultVesselsSeriesgroups, vessels)
  const defaultColor = defaultVessels[0].color

  dispatch({
    type: CREATE_FLEET,
    payload: {
      defaultVessels: defaultVesselsSeriesgroups,
      defaultTitle,
      defaultColor,
    },
  })
  dispatch(updateCurrentlyEditedDefaultTitle())
  dispatch(setFleetsModalVisibility(true))
}

export const startEditingFleet = (id) => (dispatch) => {
  dispatch({
    type: START_EDITING_FLEET,
    payload: id,
  })
  dispatch(setFleetsModalVisibility(true))
}

export const toggleVesselInCurrentlyEditedFleet = (seriesgroup) => (dispatch) => {
  dispatch({
    type: TOGGLE_VESSEL_IN_CURRENTLY_EDITED_FLEET,
    payload: seriesgroup,
  })
  dispatch(updateCurrentlyEditedDefaultTitle())
}

export const setCurrentlyEditedFleetColor = (color) => ({
  type: SET_CURRENTLY_EDITED_FLEET_COLOR,
  payload: color,
})

export const setCurrentlyEditedFleetTitle = (title) => ({
  type: SET_CURRENTLY_EDITED_FLEET_TITLE,
  payload: title,
})
