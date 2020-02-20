import { PALETTE_COLORS } from 'app/config'
import { getWorkspace } from 'app/workspace/workspaceActions'
import calculateLayerId from 'app/utils/calculateLayerId'
import { toggleLayerVisibility, toggleLayerWorkspacePresence } from 'app/layers/layersActions'
import fetchEndpoint from 'app/utils/fetchEndpoint'

export const GET_LAYER_LIBRARY = 'GET_LAYER_LIBRARY'

export function getLayerLibrary() {
  return (dispatch) => {
    fetchEndpoint(`/directory`)
      .then((res) => res.json())
      .then((data) => {
        const layers = data.entries.map((l) => {
          const layer = {
            id: l.args.id,
            title: l.args.title,
            label: l.args.title,
            description: l.args.description,
            color: l.args.color ? l.args.color : PALETTE_COLORS[0].color,
            visible: false,
            type: l.type,
            url: l.args.source.args.url,
            added: false,
            library: true,
          }
          // FIXME review/flatten directory API. Include field.
          if (l.args.meta && l.args.meta.reports && l.args.meta.reports.regions) {
            layer.reportId = Object.keys(l.args.meta.reports.regions)[0]
          }

          return layer
        })

        layers.forEach((layer) => {
          layer.id = calculateLayerId(layer)
        })

        dispatch({
          type: GET_LAYER_LIBRARY,
          payload: layers,
        })

        dispatch(getWorkspace())
      })
      .catch((e) => {
        console.warn('Error retreiving /directory', e)
        dispatch({
          type: GET_LAYER_LIBRARY,
          payload: [],
        })
        dispatch(getWorkspace())
      })

    return true
  }
}

export function addLayer(layerId) {
  return (dispatch) => {
    dispatch(toggleLayerVisibility(layerId, true))
    dispatch(toggleLayerWorkspacePresence(layerId, true))
  }
}

export function removeLayer(layerId) {
  return (dispatch) => {
    dispatch(toggleLayerVisibility(layerId, false))
    dispatch(toggleLayerWorkspacePresence(layerId, false))
  }
}
