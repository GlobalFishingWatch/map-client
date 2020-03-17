import { setUrlWorkspaceId, setWorkspaceOverride } from 'app/workspace/workspaceActions'
import { getURLParameterByName, getURLPieceByName } from 'app/utils/getURLParameterByName'
import { loadTimebarChartData } from 'app/timebar/timebarActions'
import { getLoggedUser } from 'app/user/userActions'
import { resetCustomLayerForm } from 'app/layers/customLayerActions'
import { TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE } from 'app/config'

export const SET_IS_EMBEDDED = 'SET_IS_EMBEDDED'
export const SET_LAYER_MANAGEMENT_MODAL_VISIBILITY = 'SET_LAYER_MANAGEMENT_MODAL_VISIBILITY'
export const SET_LOADING_START = 'SET_LOADING_START'
export const SET_LOADING_COMPLETE = 'SET_LOADING_COMPLETE'
export const SET_LAYER_INFO_MODAL = 'SET_LAYER_INFO_MODAL'
export const TOGGLE_MAP_PANELS = 'TOGGLE_MAP_PANELS'

export const startLoading = () => ({
  type: SET_LOADING_START,
})

export const completeLoading = () => ({
  type: SET_LOADING_COMPLETE,
})

export function setLayerInfoModal(modalParams) {
  return {
    type: SET_LAYER_INFO_MODAL,
    payload: modalParams,
  }
}

export function openTimebarInfoModal() {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(
      setLayerInfoModal({
        open: true,
        info: {
          title: 'Worldwide Fishing Hours',
          description: state.literals.fishing_hours_description,
        },
      })
    )
  }
}

export const setLayerManagementModalVisibility = (visibility) => (dispatch) => {
  if (visibility === true) {
    dispatch(resetCustomLayerForm())
  }
  dispatch({
    type: SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
    payload: visibility,
  })
}

export function init() {
  return (dispatch) => {
    dispatch(getLoggedUser())

    const workspaceId = getURLParameterByName('workspace') || getURLPieceByName('workspace')
    if (workspaceId !== undefined) {
      dispatch(setUrlWorkspaceId(workspaceId))
    }

    const workspaceOverride = getURLParameterByName('params')
    const workspaceOverridePlainText = getURLParameterByName('paramsPlainText')
    if (workspaceOverride !== null || workspaceOverridePlainText !== null) {
      const workspaceOverrideRawData =
        workspaceOverridePlainText !== null
          ? decodeURIComponent(workspaceOverridePlainText)
          : atob(workspaceOverride)

      let workspaceOverrideJSON
      try {
        workspaceOverrideJSON = JSON.parse(workspaceOverrideRawData)
      } catch (e) {
        console.warn('malformed workspace override parameter', e)
      }

      if (workspaceOverrideJSON !== undefined) {
        dispatch(setWorkspaceOverride(workspaceOverrideJSON))
      }
    }

    const isEmbedded = getURLParameterByName('embedded') === 'true'
    dispatch({
      type: SET_IS_EMBEDDED,
      payload: isEmbedded,
    })

    dispatch(loadTimebarChartData(TIMELINE_OVERALL_START_DATE, TIMELINE_OVERALL_END_DATE))
  }
}

export const toggleMapPanels = (forceExpanded = null) => ({
  type: TOGGLE_MAP_PANELS,
  payload: forceExpanded,
})
