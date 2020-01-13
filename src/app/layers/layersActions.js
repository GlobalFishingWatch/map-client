import find from 'lodash/find'

import { hueToRgbHexString } from '@globalfishingwatch/map-components/components/map/utils'
import {
  LAYER_TYPES,
  LAYER_TYPES_WITH_HEADER,
  HEADERLESS_LAYERS,
  TEMPORAL_EXTENTLESS,
  CUSTOM_LAYERS_SUBTYPES,
} from 'app/constants'
import { SET_OVERALL_TIMELINE_DATES } from 'app/filters/filtersActions'
import { refreshFlagFiltersLayers } from 'app/filters/filterGroupsActions'
import { setNotification } from 'app/notifications/notificationsActions'
import calculateLayerId from 'app/utils/calculateLayerId'
import { loadCustomLayer } from './customLayerActions'
import { USER_PERMISSIONS } from 'app/constants'
import { hasUserActionPermission } from 'app/user/userSelectors'

export const SET_LAYERS = 'SET_LAYERS'
export const SET_LAYER_HEADER = 'SET_LAYER_HEADER'
export const TOGGLE_LAYER_VISIBILITY = 'TOGGLE_LAYER_VISIBILITY'
export const TOGGLE_LAYER_WORKSPACE_PRESENCE = 'TOGGLE_LAYER_WORKSPACE_PRESENCE'
export const SET_LAYER_TINT = 'SET_LAYER_TINT'
export const SET_LAYER_OPACITY = 'SET_LAYER_OPACITY'
export const TOGGLE_LAYER_SHOW_LABELS = 'TOGGLE_LAYER_SHOW_LABELS'
export const ADD_CUSTOM_LAYER = 'ADD_CUSTOM_LAYER'
export const TOGGLE_LAYER_PANEL_EDIT_MODE = 'TOGGLE_LAYER_PANEL_EDIT_MODE'
export const SET_WORKSPACE_LAYER_LABEL = 'SET_WORKSPACE_LAYER_LABEL'
export const SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE = 'SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE'

function loadLayerHeader(headerUrl, token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return new Promise((resolve) => {
    fetch(headerUrl, {
      method: 'GET',
      headers,
    })
      .then((res) => {
        if (res.status >= 400) {
          console.warn(`loading of layer header failed ${headerUrl}`)
          Promise.reject()
          return null
        }
        return res.json()
      })
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.warn(err)
      })
  })
}

// TODO This shouldn't be here
function setGlobalFiltersFromHeader(data) {
  return (dispatch) => {
    if (
      !!data.colsByName &&
      !!data.colsByName.datetime &&
      !!data.colsByName.datetime.max &&
      !!data.colsByName.datetime.min
    ) {
      dispatch({
        type: SET_OVERALL_TIMELINE_DATES,
        payload: [new Date(data.colsByName.datetime.min), new Date(data.colsByName.datetime.max)],
      })
    }
  }
}

function setLayerHeader(layerId, header) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYER_HEADER,
      payload: {
        layerId,
        header,
      },
    })
  }
}

export function addCustomLayer(subtype, id, url, name, description, data) {
  return {
    type: ADD_CUSTOM_LAYER,
    payload: {
      subtype,
      id,
      url,
      name,
      description,
      data,
    },
  }
}

export function initLayers(workspaceLayers, libraryLayers) {
  return (dispatch, getState) => {
    const state = getState()
    const canSeeVesselLayers = hasUserActionPermission(USER_PERMISSIONS.seeVesselsLayers)(state)
    if (canSeeVesselLayers) {
      workspaceLayers = workspaceLayers.filter((l) => l.type !== LAYER_TYPES.Heatmap)
      libraryLayers = libraryLayers.filter((l) => l.type !== LAYER_TYPES.Heatmap)
    }

    workspaceLayers.forEach((layer) => {
      if (layer.type === LAYER_TYPES.Heatmap && layer.tilesetId === undefined) {
        layer.tilesetId = calculateLayerId({ url: layer.url })
        console.warn(
          `Heatmap layers should specify their tilesetId. Guessing ${layer.tilesetId} from URL ${layer.url}`
        )
      }
      layer.label = layer.label || layer.title
      layer.added = true
      layer.library = false
    })

    libraryLayers.forEach((libraryLayer) => {
      const matchedWorkspaceLayer = find(
        workspaceLayers,
        (workspaceLayer) => libraryLayer.id === workspaceLayer.id
      )
      if (matchedWorkspaceLayer) {
        Object.assign(matchedWorkspaceLayer, {
          library: true,
          added: true,
          description: libraryLayer.description || matchedWorkspaceLayer.description,
          reportId: libraryLayer.reportId,
        })
      } else {
        workspaceLayers.push(Object.assign(libraryLayer, { added: false }))
      }
    })

    workspaceLayers.forEach((layer) => {
      // parses opacity attribute
      if (!!layer.opacity) {
        layer.opacity = parseFloat(layer.opacity)
      } else {
        layer.opacity = 1
      }
      // Mapbox branch compatibility: heatmap layers should have: hue, static layers: color
      if (layer.type === LAYER_TYPES.Static) {
        if (layer.color === undefined) {
          layer.color = hueToRgbHexString(layer.hue, true)
        }
        delete layer.hue
      }
      if (layer.type === LAYER_TYPES.Heatmap) {
        if (layer.hue === undefined) {
          layer.hue = 0
        }
        delete layer.color
      }
    })

    // get header promises
    const headersPromises = []
    workspaceLayers
      .filter(
        (l) =>
          (l.headerUrl !== undefined || LAYER_TYPES_WITH_HEADER.includes(l.type)) &&
          l.added === true
      )
      .forEach((layer) => {
        if (HEADERLESS_LAYERS.includes(layer.tilesetId)) {
          // headerless layers are considered temporalExtents-less too
          layer.header = {
            temporalExtentsLess: true,
            temporalExtents: TEMPORAL_EXTENTLESS,
            colsByName: [],
          }
        } else {
          const headerUrl = layer.headerUrl || `${layer.url}/header`
          const headerPromise = loadLayerHeader(headerUrl, state.user.token)
          headerPromise.then((header) => {
            if (header !== null) {
              if (header.temporalExtents === undefined || header.temporalExtents === null) {
                header.temporalExtents = TEMPORAL_EXTENTLESS
                header.temporalExtentsLess = true
              }

              layer.header = header
              dispatch(setGlobalFiltersFromHeader(header))
            }
          })
          headersPromises.push(headerPromise)
        }
      })

    // load activity layers headers
    const headersPromise = Promise.all(headersPromises.map((p) => p.catch((e) => e)))
    headersPromise
      .then(() => {
        dispatch({
          type: SET_LAYERS,
          payload: workspaceLayers
            // exclude layers that are Heatmaps and don't have a header
            .filter((layer) => layer.type !== LAYER_TYPES.Heatmap || layer.header !== undefined)
            // exclude custom layers as they need to load their data first
            .filter((layer) => layer.type !== LAYER_TYPES.Custom),
        })
        dispatch(refreshFlagFiltersLayers())

        const deprecatedLayers = workspaceLayers
          .filter((l) => l.header !== undefined && l.header.deprecated === true)
          .map((l) => l.title)

        if (deprecatedLayers.length) {
          const deprecatedLayersList = deprecatedLayers.map((l) => `"${l}"`).join(', ')
          const literal =
            deprecatedLayers.length > 1
              ? state.literals.deprecated_layers_warning_plural
              : state.literals.deprecated_layers_warning
          dispatch(
            setNotification({
              visible: true,
              type: 'warning',
              content: literal.replace('$LAYERS', deprecatedLayersList),
            })
          )
        }

        // load custom layers data
        workspaceLayers
          .filter((l) => l.type === LAYER_TYPES.Custom)
          .forEach((customLayer) => {
            const subtype = customLayer.subtype || CUSTOM_LAYERS_SUBTYPES.geojson
            const promise =
              subtype === CUSTOM_LAYERS_SUBTYPES.geojson
                ? loadCustomLayer({
                    token: state.user.token,
                    url: customLayer.url,
                  })
                : Promise.resolve({})

            promise.then((layer) => {
              dispatch(
                addCustomLayer(
                  subtype,
                  customLayer.id,
                  customLayer.url,
                  customLayer.title,
                  customLayer.description,
                  layer.data
                )
              )
            })
          })
      })
      .catch((err) => {
        console.warn(err)
      })

    return headersPromise
  }
}

export function toggleLayerVisibility(layerId, forceStatus = null) {
  return (dispatch, getState) => {
    const layer = getState().layers.workspaceLayers.find(
      (l) => l.id === layerId || l.tilesetId === layerId
    )
    if (layer === undefined) {
      console.error(
        `Attempting to toggle layer visibility for layer id "${layerId}",
        could only find ids "${getState()
          .layers.workspaceLayers.map((l) => l.id)
          .join()}"`
      )
      return
    }

    const visibility = forceStatus !== null ? forceStatus : !layer.visible
    dispatch({
      type: TOGGLE_LAYER_VISIBILITY,
      payload: {
        layerId: layer.id,
        visibility,
      },
    })
  }
}

export function toggleLayerWorkspacePresence(layerId, forceStatus = null) {
  return (dispatch, getState) => {
    const newLayer = getState().layers.workspaceLayers.find((layer) => layer.id === layerId)
    const added = forceStatus !== null ? forceStatus : !newLayer.added
    dispatch({
      type: TOGGLE_LAYER_WORKSPACE_PRESENCE,
      payload: {
        layerId,
        added,
      },
    })
    if (newLayer.type === LAYER_TYPES.Heatmap) {
      if (added === true) {
        const url = newLayer.url

        if (newLayer.header === undefined) {
          loadLayerHeader(url, getState().user.token).then((header) => {
            if (header) {
              dispatch(setLayerHeader(layerId, header))
              dispatch(setGlobalFiltersFromHeader(header))
              dispatch(refreshFlagFiltersLayers())
            }
          })
        } else {
          dispatch(refreshFlagFiltersLayers())
        }
      } else {
        dispatch(refreshFlagFiltersLayers())
      }
    }
  }
}

export function setLayerOpacity(opacity, layerId) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYER_OPACITY,
      payload: {
        layerId,
        opacity,
      },
    })
  }
}

export function setLayerTint(color, hue, layerId) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_LAYER_TINT,
      payload: {
        layerId,
        color,
        hue,
      },
    })

    const newLayer = getState().layers.workspaceLayers.find((layer) => layer.id === layerId)
    if (newLayer.type === LAYER_TYPES.Heatmap) {
      dispatch(refreshFlagFiltersLayers())
    }
  }
}

export function toggleLayerShowLabels(layerId) {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_LAYER_SHOW_LABELS,
      payload: {
        layerId,
      },
    })
  }
}

export function toggleLayerPanelEditMode(forceMode = null) {
  return {
    type: TOGGLE_LAYER_PANEL_EDIT_MODE,
    payload: {
      forceMode,
    },
  }
}

export function setLayerLabel(layerId, label) {
  return {
    type: SET_WORKSPACE_LAYER_LABEL,
    payload: {
      layerId,
      label,
    },
  }
}

export function confirmLayerRemoval(layerId) {
  return {
    type: SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE,
    payload: layerId,
  }
}
