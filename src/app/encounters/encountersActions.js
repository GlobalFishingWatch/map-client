import fetchEndpoint from 'app/utils/fetchEndpoint'
// import { highlightClickedVessel, clearHighlightedClickedVessel } from 'activityLayers/heatmapActions'; TODO MAP MODULE
import { VESSEL_TYPE_REEFER } from 'app/constants'
import { ENCOUNTERS_VESSEL_COLOR, ENCOUNTERS_REEFER_COLOR } from 'app/config'
import buildEndpoint from 'app/utils/buildEndpoint'

export const LOAD_ENCOUNTERS_INFO = 'LOAD_ENCOUNTERS_INFO'
export const SET_ENCOUNTERS_INFO = 'SET_ENCOUNTERS_INFO'
export const SET_ENCOUNTERS_VESSEL_INFO = 'SET_ENCOUNTERS_VESSEL_INFO'
export const CLEAR_ENCOUNTERS_INFO = 'CLEAR_ENCOUNTERS_INFO'
export const HIDE_ENCOUNTERS_INFO_PANEL = 'HIDE_ENCOUNTERS_INFO_PANEL'

export function hideEncountersInfoPanel() {
  return {
    type: HIDE_ENCOUNTERS_INFO_PANEL,
  }
}

export function clearEncountersInfo() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ENCOUNTERS_INFO,
    })
    // dispatch(clearHighlightedClickedVessel()); TODO MAP MODULE
  }
}

export function setEncountersInfo(id, tilesetId) {
  return (dispatch, getState) => {
    const workspaceLayers = getState().layers.workspaceLayers
    const encounterLayer = workspaceLayers.find(
      (l) => l.tilesetId === tilesetId || l.id === tilesetId
    )

    // dispatch(highlightClickedVessel(id, encounterLayer.id)); TODO MAP MODULE

    if (
      encounterLayer.header.endpoints === undefined ||
      encounterLayer.header.endpoints.info === undefined
    ) {
      console.warn("Info field is missing on header's urls, can't display encounters details")
      return
    }
    const encounterInfoEndpoint = encounterLayer.header.endpoints.info

    dispatch({
      type: LOAD_ENCOUNTERS_INFO,
      payload: {
        id,
        tilesetId,
      },
    })

    const infoUrl = buildEndpoint(encounterInfoEndpoint, {
      id,
    })

    fetchEndpoint(infoUrl).then((encounterInfo) => {
      encounterInfo.vessels = [
        {
          tilesetId: encounterInfo.vessel_1_tileset,
          id: encounterInfo.vessel_1_id.toString(),
          vesselTypeName: encounterInfo.vessel_1_type,
          color:
            encounterInfo.vessel_1_type === VESSEL_TYPE_REEFER
              ? ENCOUNTERS_REEFER_COLOR
              : ENCOUNTERS_VESSEL_COLOR,
        },
        {
          tilesetId: encounterInfo.vessel_2_tileset,
          id: encounterInfo.vessel_2_id.toString(),
          vesselTypeName: encounterInfo.vessel_2_type,
          color:
            encounterInfo.vessel_2_type === VESSEL_TYPE_REEFER
              ? ENCOUNTERS_REEFER_COLOR
              : ENCOUNTERS_VESSEL_COLOR,
        },
      ]

      dispatch({
        type: SET_ENCOUNTERS_INFO,
        payload: {
          encounterInfo,
        },
      })

      encounterInfo.vessels.forEach((vessel) => {
        const vesselWorkspaceLayer = workspaceLayers.find(
          (workspaceLayer) =>
            workspaceLayer.tilesetId === vessel.tilesetId || workspaceLayer.id === vessel.tilesetId
        )
        const fields = vesselWorkspaceLayer.header.info.fields
        fetchEndpoint(
          buildEndpoint(vesselWorkspaceLayer.header.endpoints.info, {
            id: vessel.id,
          })
        ).then((vesselInfo) => {
          dispatch({
            type: SET_ENCOUNTERS_VESSEL_INFO,
            payload: {
              id: vessel.id,
              vesselInfo,
              fields,
            },
          })
        })
      })
    })
  }
}
