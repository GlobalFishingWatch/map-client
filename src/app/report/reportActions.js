import { toggleLayerVisibility, setLayerOpacity } from 'app/layers/layersActions'
// import { clearHighlightedVessels } from 'activityLayers/heatmapActions'; TODO MAP MODULE
import { FLAGS } from 'app/constants'
import fetchEndpoint from 'app/utils/fetchEndpoint'

export const SET_CURRENT_SELECTED_POLYGON = 'SET_CURRENT_SELECTED_POLYGON'
export const ADD_REPORT_POLYGON = 'ADD_REPORT_POLYGON'
export const DELETE_REPORT_POLYGON = 'DELETE_REPORT_POLYGON'
export const CLEAR_REPORT_POLYGON = 'CLEAR_REPORT_POLYGON'
export const DISCARD_REPORT = 'DISCARD_REPORT'
export const SET_SUBSCRIPTION_STATUS_SENT = 'SET_SUBSCRIPTION_STATUS_SENT'
export const SET_SUBSCRIPTION_STATUS_ERROR = 'SET_SUBSCRIPTION_STATUS_ERROR'
export const SET_REPORT_POLYGON = 'SET_REPORT_POLYGON'
export const START_REPORT = 'START_REPORT'
export const TOGGLE_REPORT_MODAL_VISIBILITY = 'TOGGLE_REPORT_MODAL_VISIBILITY'
export const TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY = 'TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY'
export const UPDATE_SUBSCRIPTION_FREQUENCY = 'UPDATE_SUBSCRIPTION_FREQUENCY'

export const setCurrentSelectedPolygon = (polygon) => ({
  type: SET_CURRENT_SELECTED_POLYGON,
  payload: polygon,
})

function addPolygon(reportingId, name) {
  return {
    type: ADD_REPORT_POLYGON,
    payload: {
      reportingId,
      name,
    },
  }
}

export function deletePolygon(polygonIndex) {
  return (dispatch) => {
    dispatch({
      type: DELETE_REPORT_POLYGON,
      payload: {
        polygonIndex,
      },
    })
  }
}

export function updateSubscriptionFrequency(frequency) {
  return {
    type: UPDATE_SUBSCRIPTION_FREQUENCY,
    payload: { frequency },
  }
}

export function toggleSubscriptionModalVisibility(forceMode = null) {
  return {
    type: TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY,
    payload: { forceMode },
  }
}

export function toggleReportPanelVisibility(forceMode = null) {
  return {
    type: TOGGLE_REPORT_MODAL_VISIBILITY,
    payload: { forceMode },
  }
}

export function toggleCurrentReportPolygon() {
  return (dispatch, getState) => {
    const state = getState()
    const report = state.report
    const currentPolygon = report.currentSelectedPolygon
    const reportingId = currentPolygon.reporting_id
    const reportingName = currentPolygon.reporting_name
    const polygonIndex = report.polygons.findIndex((polygon) => polygon.reportingId === reportingId)

    if (polygonIndex === -1) {
      if (reportingId === undefined || reportingName === undefined) {
        console.warn('reporting_id/name missing', currentPolygon)
        return
      }
      dispatch(addPolygon(reportingId, reportingName))
    } else {
      dispatch(deletePolygon(polygonIndex))
    }
  }
}

function startReport(layerId) {
  return (dispatch, getState) => {
    dispatch(toggleLayerVisibility(layerId, true))
    dispatch(toggleReportPanelVisibility())
    dispatch(setLayerOpacity(1, layerId))
    // dispatch(clearHighlightedVessels()); TODO MAP MODULE

    const workspaceLayer = getState().layers.workspaceLayers.find((layer) => layer.id === layerId)

    dispatch({
      type: START_REPORT,
      payload: {
        layerId,
        layerTitle: workspaceLayer.title,
        reportId: workspaceLayer.reportId,
      },
    })
  }
}

export function discardReport() {
  return (dispatch) => {
    dispatch(toggleReportPanelVisibility(false))
    dispatch({
      type: DISCARD_REPORT,
    })
  }
}

export function toggleReport(layerId) {
  return (dispatch, getState) => {
    if (getState().report.layerId === layerId) {
      dispatch(discardReport())
    } else {
      dispatch(startReport(layerId))
    }
  }
}

/**
 + Get current countries name from the filters only if they exist
 * @param {object} state
 * @returns {array} flags ['AD', 'ES', ...]
 */
function getCurrentFlags(state) {
  return state.filterGroups.filterGroups
    .filter((filter) => filter.filterValues !== undefined && filter.filterValues.flag !== undefined)
    .map((filter) => filter.filterValues.flag)
    .map((flags) => flags.map((flag) => FLAGS[flag]))
    .reduce((a1, a2) => a1.concat(a2), [])
}

export function sendSubscription() {
  return (dispatch, getState) => {
    const state = getState()

    if (!state.user.token) {
      console.warn('user is not authenticated')
      return
    }

    const payload = {
      from: state.filters.timelineInnerExtent[0].toISOString(),
      to: state.filters.timelineInnerExtent[1].toISOString(),
    }

    payload.filters = {
      flags: getCurrentFlags(state),
    }

    payload.regions = []
    state.report.polygons.forEach((polygon) => {
      payload.regions.push({
        layer: state.layers.workspaceLayers.find(
          (layer) => layer.reportId === state.report.reportId
        ).label,
        id: polygon.reportingId.toString(),
        name: polygon.name.toString(),
      })
    })

    const fishingActivityLayer = state.layers.workspaceLayers.find((l) => l.id === 'fishing')
    if (fishingActivityLayer === undefined) {
      dispatch({
        type: SET_SUBSCRIPTION_STATUS_ERROR,
        payload: 'Fishing activity layer not available on this workspace',
      })
      return
    }

    let url = `${fishingActivityLayer.url}/reports`

    if (state.report.subscriptionFrequency !== 'single') {
      url = `${url}/subscriptions`
      payload.recurrency = state.report.subscriptionFrequency
    }

    const options = {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    }
    fetchEndpoint(url, options)
      .then((data) => {
        dispatch({
          type: SET_SUBSCRIPTION_STATUS_SENT,
          payload: data.message,
        })
      })
      .catch((err) => {
        const message = `Error sending report ${err.status} - ${err.message}`
        dispatch({
          type: SET_SUBSCRIPTION_STATUS_ERROR,
          payload: message,
        })
      })
  }
}
