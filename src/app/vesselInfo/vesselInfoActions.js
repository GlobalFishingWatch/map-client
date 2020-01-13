import { resetNotification, setNotification } from 'app/notifications/notificationsActions'
import { trackSearchResultClicked, trackVesselPointClicked } from 'app/analytics/analyticsActions'
import { addVesselToRecentVesselList } from 'app/recentVessels/recentVesselsActions'
import { toggleMapPanels } from 'app/app/appActions'
import getVesselName from 'app/utils/getVesselName'
import fetchEndpoint from 'app/utils/fetchEndpoint'
import buildEndpoint from 'app/utils/buildEndpoint'
import { fitTimelineToTrack } from 'app/filters/filtersActions'
import { targetMapVessel } from '@globalfishingwatch/map-components/components/map/store'
import { startLoading, completeLoading } from 'app/app/appActions'
import { USER_PERMISSIONS } from 'app/constants'
import { hasUserActionPermission } from 'app/user/userSelectors'

export const ADD_VESSEL = 'ADD_VESSEL'
export const SET_VESSEL_DETAILS = 'SET_VESSEL_DETAILS'
export const SHOW_VESSEL_DETAILS = 'SHOW_VESSEL_DETAILS'
export const SET_VESSEL_ERROR = 'SET_VESSEL_ERROR'
export const CLEAR_VESSEL_INFO = 'CLEAR_VESSEL_INFO'
export const HIDE_VESSELS_INFO_PANEL = 'HIDE_VESSELS_INFO_PANEL'
export const TOGGLE_VESSEL_PIN = 'TOGGLE_VESSEL_PIN'
export const SET_PINNED_VESSEL_COLOR = 'SET_PINNED_VESSEL_COLOR'
export const SET_PINNED_VESSEL_TITLE = 'SET_PINNED_VESSEL_TITLE'
export const LOAD_PINNED_VESSEL = 'LOAD_PINNED_VESSEL'
export const TOGGLE_PINNED_VESSEL_EDIT_MODE = 'TOGGLE_PINNED_VESSEL_EDIT_MODE'
export const SET_PINNED_VESSEL_TRACK_VISIBILITY = 'SET_PINNED_VESSEL_TRACK_VISIBILITY'
export const HIGHLIGHT_TRACK = 'HIGHLIGHT_TRACK'

const getVesselId = (vessel, layerId, layers) => {
  const layer = layers.find((l) => l.id === layerId)
  const header = layer.header
  const idFieldKey = header.info.id === undefined ? 'seriesgroup' : header.info.id
  const id = vessel[idFieldKey]
  if (id === undefined) {
    console.warn('Cant lookup feature of layer', layer.id, ':')
    console.warn('Identifier field', idFieldKey, 'cant be found on the selected feature')
    console.warn('Header setting identifier field to', header.info.id, '(fallback to seriesgroup)')
    return null
  }
  return id
}

function showVesselDetails(tilesetId, id) {
  return {
    type: SHOW_VESSEL_DETAILS,
    payload: {
      id,
      tilesetId,
    },
  }
}

function setCurrentVessel(tilesetId, id) {
  return (dispatch, getState) => {
    const state = getState()
    const token = state.user.token
    const layer = state.layers.workspaceLayers.find(
      (l) => l.header !== undefined && (l.tilesetId === tilesetId || l.id === tilesetId)
    )

    if (layer === undefined) {
      console.warn('Unable to select feature - cant find layer', tilesetId)
      return
    }

    const vesselInfoUrl = buildEndpoint(layer.header.endpoints.info, {
      id,
    })
    dispatch(startLoading())
    fetchEndpoint(vesselInfoUrl, token)
      .then((data) => {
        dispatch(completeLoading())
        if (data !== null) {
          delete data.series
          data.tilesetId = tilesetId

          dispatch({
            type: SET_VESSEL_DETAILS,
            payload: {
              id,
              vesselData: data,
              layer,
            },
          })
          dispatch(showVesselDetails(tilesetId, id))
          dispatch(toggleMapPanels(true))

          dispatch(
            addVesselToRecentVesselList(
              id,
              getVesselName(data, layer.header.info.fields),
              tilesetId
            )
          )

          if (data.comment) {
            dispatch(
              setNotification({
                content: data.comment,
                type: 'warning',
                visible: true,
              })
            )
          }
        }
      })
      .catch((e) => {
        dispatch(completeLoading())
        dispatch({
          type: SET_VESSEL_ERROR,
        })
      })
  }
}

export function setPinnedVesselColor(id, color) {
  return {
    type: SET_PINNED_VESSEL_COLOR,
    payload: {
      id,
      color,
    },
  }
}

export function setPinnedVesselTitle(id, title) {
  return {
    type: SET_PINNED_VESSEL_TITLE,
    payload: {
      id,
      title,
    },
  }
}

export function togglePinnedVesselVisibility(id, forceStatus = null) {
  return (dispatch, getState) => {
    const currentVessel = getState().vesselInfo.vessels.find((vessel) => vessel.id === id)
    if (currentVessel) {
      const visible = forceStatus !== null ? forceStatus : !currentVessel.visible
      dispatch({
        type: SET_PINNED_VESSEL_TRACK_VISIBILITY,
        payload: {
          id,
          visible,
        },
      })
    }
  }
}

const applyFleetOverridesForVessel = (id, fleet) => (dispatch) => {
  dispatch(togglePinnedVesselVisibility(id, fleet.visible))
  dispatch(setPinnedVesselColor(id, fleet.color))
}

export const applyFleetOverrides = () => (dispatch, getState) => {
  const fleets = getState().fleets.fleets
  const currentVesselsIds = getState().vesselInfo.vessels.map((v) => v.id)
  fleets.forEach((fleet) => {
    fleet.vessels.forEach((fleetVessel) => {
      if (currentVesselsIds.indexOf(fleetVessel) > -1) {
        dispatch(applyFleetOverridesForVessel(fleetVessel, fleet))
      }
    })
  })
}

export function setPinnedVessels(pinnedVessels, shownVessel) {
  return (dispatch, getState) => {
    const state = getState()
    const { token } = state.user

    pinnedVessels.forEach((pinnedVessel) => {
      let layer = state.layers.workspaceLayers.find((l) => l.tilesetId === pinnedVessel.tilesetId)
      if (!layer) {
        layer = state.layers.workspaceLayers.find((l) => l.id === pinnedVessel.tilesetId)
      }
      if (layer === undefined) {
        console.warn(
          'Trying to load a pinned vessel but the layer seems to be absent on the workspace',
          pinnedVessel
        )
        return
      }

      const pinnedVesselUrl = buildEndpoint(layer.header.endpoints.info, {
        id: pinnedVessel.id,
      })
      fetchEndpoint(pinnedVesselUrl, token).then((data) => {
        if (data !== null) {
          delete data.series
          dispatch({
            type: LOAD_PINNED_VESSEL,
            payload: Object.assign({}, pinnedVessel, data),
          })

          const fleets = getState().fleets.fleets
          const parentFleet = fleets.find((f) => f.vessels.indexOf(pinnedVessel.id) > -1)
          if (parentFleet) {
            dispatch(applyFleetOverridesForVessel(pinnedVessel.id, parentFleet))
          } else {
            dispatch(togglePinnedVesselVisibility(pinnedVessel.id, pinnedVessel.visible === true))
          }

          dispatch(
            addVesselToRecentVesselList(
              pinnedVessel.id,
              getVesselName(pinnedVessel, layer.header.info.fields),
              pinnedVessel.tilesetId
            )
          )

          if (shownVessel !== null && shownVessel.id === pinnedVessel.id) {
            dispatch({
              type: SET_VESSEL_DETAILS,
              payload: {
                id: pinnedVessel.id,
                vesselData: data,
                layer,
              },
            })
            dispatch(showVesselDetails(pinnedVessel.tilesetId, pinnedVessel.id))
          }
        }
      })
    })
  }
}

export function hideVesselsInfoPanel() {
  return {
    type: HIDE_VESSELS_INFO_PANEL,
  }
}

export function addVessel({ tilesetId, id, parentEncounter = null }) {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({
      type: ADD_VESSEL,
      payload: {
        id,
        tilesetId,
        parentEncounter,
      },
    })
    const canSeeVesselBasicInfo = hasUserActionPermission(USER_PERMISSIONS.seeVesselBasicInfo)(
      state
    )

    if (canSeeVesselBasicInfo) {
      dispatch(setCurrentVessel(tilesetId, id))
    } else {
      dispatch(hideVesselsInfoPanel())
    }
  }
}

export const addVesselFromHeatmap = (feature) => (dispatch, getState) => {
  const layer = getState().layers.workspaceLayers.find((l) => l.id === feature.layer.id)
  const id = getVesselId(
    feature.properties,
    feature.layer.id,
    getState().layers.workspaceLayers
  ).toString()

  dispatch(
    addVessel({
      tilesetId: layer.tilesetId || layer.id,
      id,
    })
  )

  dispatch(trackVesselPointClicked(layer.id, id))
}

export const addVesselFromSearch = (vessel) => (dispatch, getState) => {
  const layer = getState().layers.workspaceLayers.find((l) => l.tilesetId === vessel.tilesetId)
  const id = getVesselId(vessel, layer.id, getState().layers.workspaceLayers).toString()

  dispatch(
    addVessel({
      tilesetId: layer.tilesetId,
      id,
    })
  )

  dispatch(trackSearchResultClicked(layer.id, id))
}

export function addVesselFromEncounter(tilesetId, id) {
  return (dispatch, getState) => {
    const state = getState()
    const parentEncounter = {
      id: state.encounters.id,
      tilesetId: state.encounters.tilesetId,
    }
    dispatch(
      addVessel({
        tilesetId,
        id: id.toString(),
        parentEncounter,
      })
    )
  }
}

export function clearVesselInfo() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_VESSEL_INFO,
    })
    dispatch(resetNotification())
  }
}

function _getPinAction(state, id) {
  const vesselIndex = state.vesselInfo.vessels.findIndex((vessel) => vessel.id === id)
  const vessel = state.vesselInfo.vessels[vesselIndex]
  const pinned = !vessel.pinned

  let visible = false

  // when pinning the vessel currently in info panel, should be initially visible
  if (pinned === true) {
    visible = true
  }
  return {
    type: TOGGLE_VESSEL_PIN,
    payload: {
      vesselIndex,
      pinned,
      visible,
      id: vessel.id,
      vesselname: vessel.vesselname,
      tilesetId: vessel.layerId,
    },
  }
}

export function toggleActiveVesselPin(id) {
  return (dispatch, getState) => {
    dispatch(_getPinAction(getState(), id))
  }
}

export function toggleVesselPin(id) {
  return (dispatch, getState) => {
    dispatch(_getPinAction(getState(), id))
  }
}

export function togglePinnedVesselEditMode(forceMode = null) {
  return {
    type: TOGGLE_PINNED_VESSEL_EDIT_MODE,
    payload: {
      forceMode,
    },
  }
}

export function togglePinnedVesselDetails(id, label, tilesetId) {
  return (dispatch, getState) => {
    const hide =
      getState().vesselInfo.currentlyShownVessel &&
      getState().vesselInfo.currentlyShownVessel.id === id

    if (hide === true) {
      dispatch(clearVesselInfo())
    } else {
      dispatch(addVesselToRecentVesselList(id, label, tilesetId))
      dispatch(togglePinnedVesselVisibility(id, true))
      dispatch(showVesselDetails(tilesetId, id))
    }
  }
}

export const targetCurrentlyShownVessel = () => (dispatch, getState) => {
  const currentVessel = getState().vesselInfo.currentlyShownVessel
  const id = currentVessel.id
  const timelineBounds = targetMapVessel(id)
  dispatch(fitTimelineToTrack(timelineBounds))
}

export const highlightTrack = (id) => ({
  type: HIGHLIGHT_TRACK,
  payload: id,
})
