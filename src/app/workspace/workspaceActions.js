import 'whatwg-fetch'
import { COLORS, TRACK_DEFAULT_COLOR } from 'app/config'
import { LAYER_TYPES, ENCOUNTERS_AIS } from 'app/constants'
import { initBasemap } from 'app/basemap/basemapActions'
import { initLayers } from 'app/layers/layersActions'
import { saveFilterGroup } from 'app/filters/filterGroupsActions'
import {
  setOuterTimelineDates,
  SET_INNER_TIMELINE_DATES_FROM_WORKSPACE,
  setSpeed,
} from 'app/filters/filtersActions'
import { setPinnedVessels, addVessel } from 'app/vesselInfo/vesselInfoActions'
import { setFleetsFromWorkspace } from 'app/fleets/fleetsActions'
import { loadRecentVesselsList } from 'app/recentVessels/recentVesselsActions'
import { setEncountersInfo } from 'app/encounters/encountersActions'
import {
  getKeyByValue,
  hueToClosestColor,
  hueToRgbHexString,
  COLOR_HUES,
} from '@globalfishingwatch/map-components/components/map/utils'
import defaultWorkspace from 'app/workspace/workspace'
import { setNotification } from 'app/notifications/notificationsActions'
import fetchEndpoint from 'app/utils/fetchEndpoint'

const LOCAL_WORKSPACE = process.env.REACT_APP_LOCAL_WORKSPACE === true

export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE'
export const TRANSITION_ZOOM = 'TRANSITION_ZOOM'
export const UPDATE_MOUSE_LAT_LON = 'UPDATE_MOUSE_LAT_LON'
export const SET_URL_WORKSPACE_ID = 'SET_URL_WORKSPACE_ID'
export const SET_WORKSPACE_ID = 'SET_WORKSPACE_ID'
export const SET_WORKSPACE_OVERRIDE = 'SET_WORKSPACE_OVERRIDE'
export const DELETE_WORKSPACE_ID = 'DELETE_WORKSPACE_ID'

export function setUrlWorkspaceId(workspaceId) {
  return {
    type: SET_URL_WORKSPACE_ID,
    payload: workspaceId,
  }
}

/**
 * Save the workspace's ID in the store
 *
 * @export setWorkspaceId
 * @param {string} workspaceId
 * @returns {object}
 */
export function setWorkspaceId(workspaceId) {
  return {
    type: SET_WORKSPACE_ID,
    payload: workspaceId,
  }
}

/**
 * Sets workspace override: an object set in a GET param to override parameters in the normal workspace,
 * used to create workspaces 'on the fly'
 *
 * @param {object} workspaceOverride An object containing overrides allowed by the spec,
 * see https://github.com/GlobalFishingWatch/map-client#params
 */
export function setWorkspaceOverride(workspaceOverride) {
  return {
    type: SET_WORKSPACE_OVERRIDE,
    payload: workspaceOverride,
  }
}

/**
 * Delete the workspace id from the store
 *
 * @export deleteWorkspace
 * @returns {object}
 */
export function deleteWorkspace() {
  return {
    type: DELETE_WORKSPACE_ID,
  }
}

/**
 * Update the URL according to the parameters present in the store
 *
 * @export updateURL
 * @returns {object}
 */
export function updateURL() {
  return (dispatch, getState) => {
    const newURL = `${window.location.origin}${window.location.pathname.replace(
      /\/$/g,
      ''
    )}/?workspace=${getState().workspace.workspaceId}`
    window.history.pushState({ path: newURL }, '', newURL)
  }
}

// Stores viewport updates emitted by map for future workspace saving
export const updateWorkspace = (props) => ({
  type: UPDATE_WORKSPACE,
  payload: props,
})

export const incrementZoom = () => ({
  type: TRANSITION_ZOOM,
  payload: +1,
})

export const decrementZoom = () => ({
  type: TRANSITION_ZOOM,
  payload: -1,
})

export const updateMouseLatLon = (mouseLatLon) => ({
  type: UPDATE_MOUSE_LAT_LON,
  payload: mouseLatLon,
})

/**
 * Save the state of the map, the filters and the timeline and send it
 * to the API. Get back the id of the workspace and save it in the store.
 * In case of error, call the error action callback with the error string.
 *
 * @export saveWorkspace
 * @param {function} errorAction - action to dispatch in case of error
 * @returns {object}
 */
export function saveWorkspace(errorAction) {
  // FIXME double check filtergoups hue save
  return (dispatch, getState) => {
    const state = getState()
    const shownVesselData = state.vesselInfo.vessels.find((e) => e.shownInInfoPanel === true)
    let shownVessel = null
    if (shownVesselData !== undefined) {
      shownVessel = {
        id: shownVesselData.id,
        tilesetId: shownVesselData.tilesetId,
      }
      if (shownVesselData.series !== null) {
        shownVessel.series = shownVesselData.series
      }
    }

    const layers = state.layers.workspaceLayers
      .filter((layer) => layer.added)
      .map((layer) => {
        const newLayer = Object.assign({}, layer)
        // TODO Should we use a whitelist of fields instead ?
        delete newLayer.header
        return newLayer
      })

    const basemap = state.basemap.basemapLayers.find(
      (basemapLayer) => basemapLayer.isOption !== true && basemapLayer.visible === true
    ).id
    const basemapOptions = state.basemap.basemapLayers
      .filter((basemapLayer) => basemapLayer.isOption === true && basemapLayer.visible === true)
      .map((basemapLayer) => basemapLayer.id)

    const workspaceData = {
      workspace: {
        map: {
          center: state.workspace.viewport.center,
          //  Compatibility: A Mapbox GL JS zoom z means z-1
          zoom: state.workspace.viewport.zoom + 1,
          layers,
        },
        pinnedVessels: state.vesselInfo.vessels
          .filter((e) => e.pinned === true)
          .map((e) => ({
            id: e.id,
            tilesetId: e.tilesetId,
            title: e.title,
            visible: e.visible,
            color: e.color,
          })),
        fleets: state.fleets.fleets,
        shownVessel,
        encounters: {
          id: state.encounters.id,
          tilesetId: state.encounters.tilesetId,
        },
        basemap,
        basemapOptions,
        timeline: {
          // We store the timestamp
          innerExtent: state.filters.timelineInnerExtent.map((e) => +e),
          outerExtent: state.filters.timelineOuterExtent.map((e) => +e),
        },
        filters: state.filters.flags,
        timelineSpeed: state.filters.timelineSpeed,
        filterGroups: state.filterGroups.filterGroups,
      },
    }

    fetchEndpoint(`/v2/workspaces`, {
      method: 'POST',
      body: JSON.stringify(workspaceData),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setWorkspaceId(data.id))
        dispatch(updateURL())
      })
      .catch(({ message }) => dispatch(errorAction(message)))
  }
}

function dispatchActions(workspaceData, dispatch, getState) {
  const state = getState()
  const workspace = { ...workspaceData }
  // Mapbox branch compatibility: A Mapbox GL JS zoom z means z-1 on GMaps
  workspace.viewport.zoom = workspaceData.viewport.zoom - 1

  // We update the dates of the timeline
  const autoTimeline = workspaceData.timeline.auto !== undefined
  let timelineInnerDates
  let timelineOuterDates
  if (autoTimeline) {
    const ONE_DAY = 24 * 60 * 60 * 1000
    const daysEndInnerOuterFromToday = workspaceData.timeline.auto.daysEndInnerOuterFromToday || 4
    const daysInnerExtent = workspaceData.timeline.auto.daysInnerExtent || 30
    // today - n days
    const end = new Date().getTime() - daysEndInnerOuterFromToday * ONE_DAY
    // inner should be 30 days long
    const innerStart = end - daysInnerExtent * ONE_DAY
    // start outer at beginning of year
    const innerStartYear = new Date(innerStart).getFullYear()
    const outerStart = new Date(innerStartYear, 0, 1).getTime() + (ONE_DAY - 1)
    timelineInnerDates = [new Date(innerStart), new Date(end)]
    timelineOuterDates = [new Date(outerStart), new Date(end)]
  } else {
    timelineInnerDates = workspaceData.timeline.innerExtent.map((d) => new Date(d))
    timelineOuterDates = workspaceData.timeline.outerExtent.map((d) => new Date(d))
  }

  dispatch({
    type: SET_INNER_TIMELINE_DATES_FROM_WORKSPACE,
    payload: timelineInnerDates,
  })

  dispatch(setOuterTimelineDates(timelineOuterDates))

  dispatch(initBasemap(workspaceData.basemap, workspaceData.basemapOptions))

  dispatch(setSpeed(workspaceData.timelineSpeed))

  dispatch(updateWorkspace(workspace))

  dispatch(initLayers(workspaceData.layers, state.layerLibrary.layers)).then(() => {
    // we need heatmap layers headers to be loaded before loading track
    if (workspaceData.shownVessel) {
      if (workspaceData.shownVessel.id === undefined) {
        console.warn(
          `attempting to load vessel on tileset ${workspaceData.shownVessel.tilesetId} with no id/seriesgroup`
        )
      } else {
        const { tilesetId, id } = workspaceData.shownVessel

        // only add vessel if it won't be loaded by loading pinned vessels mechanism later
        if (!workspaceData.pinnedVessels.map((v) => v.id).includes(id)) {
          dispatch(
            addVessel({
              tilesetId,
              id,
            })
          )
        }
      }
    }
    // Mapbox branch compatibility: track layers should have color, not hue
    workspaceData.pinnedVessels.forEach((pinnedVessel) => {
      if (pinnedVessel.color === undefined) {
        pinnedVessel.color =
          pinnedVessel.hue !== undefined
            ? hueToRgbHexString(pinnedVessel.hue, true)
            : TRACK_DEFAULT_COLOR
      }
      delete pinnedVessel.hue
    })

    dispatch(setPinnedVessels(workspaceData.pinnedVessels, workspaceData.shownVessel))
    dispatch(setFleetsFromWorkspace(workspaceData.fleets))

    if (
      workspaceData.encounters !== null &&
      workspaceData.encounters !== undefined &&
      workspaceData.encounters.id !== null &&
      workspaceData.encounters.id !== undefined
    ) {
      dispatch(setEncountersInfo(workspaceData.encounters.id, workspaceData.encounters.tilesetId))
    }
  })

  dispatch(loadRecentVesselsList())

  if (workspaceData.filterGroups) {
    workspaceData.filterGroups.forEach((filterGroup) => {
      // Mapbox branch compatibility: filter groups are not saved as color literals anymore (ie 'pink'). Convert to hue.
      if (filterGroup.color !== undefined) {
        const colorLiteralFromHex = getKeyByValue(COLORS, filterGroup.color)
        filterGroup.hue = COLOR_HUES[colorLiteralFromHex || filterGroup.color]
        delete filterGroup.color
      }
      dispatch(saveFilterGroup(filterGroup))
    })
  }
}

/**
 * Convert filters to filterGroups only with the filter flag in the AIS layer
 *
 * @param {array} filters
 * @return {array} filterGroups
 */
const filtersToFilterGroups = (filters, layers) => {
  if (filters === undefined || (filters.length === 1 && Object.keys(filters[0]).length !== 0))
    return [] // remove empty filters
  const checkedLayers = {}
  layers
    .filter((layer) => layer.type === LAYER_TYPES.Heatmap)
    .forEach((layer) => {
      checkedLayers[layer.id] = true
    })
  const filterGroups = []
  filters.forEach((filter, index) => {
    if (filter.flag) {
      filterGroups.push({
        checkedLayers,
        color: hueToClosestColor(filter.hue) || Object.keys(COLORS)[0],
        filterValues: { flag: [parseInt(filter.flag, 10)] },
        label: `Filter ${index + 1}`,
        visible: true,
      })
    } else if (filter.category) {
      filterGroups.push({
        checkedLayers,
        color: hueToClosestColor(filter.hue) || Object.keys(COLORS)[0],
        filterValues: { flag: [parseInt(filter.category, 10)] },
        label: `Filter ${index + 1}`,
        visible: true,
      })
    }
  })
  return filterGroups
}

const convertLegacyEncountersLayers = (layers) => {
  return layers.map((layer) => {
    if (layer.type !== LAYER_TYPES.Encounters) {
      return layer
    }
    return {
      ...layer,
      id: ENCOUNTERS_AIS,
      type: LAYER_TYPES.Static,
      color: hueToRgbHexString(layer.hue, true),
      showInPanel: 'activity',
      headerUrl: `${layer.url}/header`,
    }
  })
}

const convertSeriesgroupsToIds = (workspace) => {
  const newWorkspace = { ...workspace }
  if (newWorkspace.shownVessel !== undefined && newWorkspace.shownVessel !== null) {
    newWorkspace.shownVessel.id =
      newWorkspace.shownVessel.id || newWorkspace.shownVessel.seriesgroup
    delete newWorkspace.shownVessel.seriesgroup
  }
  if (newWorkspace.pinnedVessels !== undefined && newWorkspace.pinnedVessels !== null) {
    newWorkspace.pinnedVessels.forEach((vessel) => {
      vessel.id = vessel.id || vessel.seriesgroup
      delete vessel.seriesgroup
    })
  }
  if (newWorkspace.encounters !== undefined && newWorkspace.encounters !== null) {
    newWorkspace.encounters.id = newWorkspace.encounters.id || newWorkspace.encounters.seriesgroup
    delete newWorkspace.encounters.seriesgroup
  }
  return newWorkspace
}

function processNewWorkspace(data) {
  const workspace = convertSeriesgroupsToIds(data.workspace)
  let filterGroups = workspace.filterGroups || []
  filterGroups = filterGroups.concat(filtersToFilterGroups(workspace.filters, workspace.map.layers))
  const layers = convertLegacyEncountersLayers(workspace.map.layers)

  return {
    viewport: {
      zoom: workspace.map.zoom,
      center: workspace.map.center,
    },
    timeline: workspace.timeline,
    timelineSpeed: workspace.timelineSpeed,
    basemap: workspace.basemap,
    basemapOptions: workspace.basemapOptions || [],
    layers,
    filters: workspace.filters,
    shownVessel: workspace.shownVessel,
    pinnedVessels: workspace.pinnedVessels,
    fleets: workspace.fleets || [],
    encounters: workspace.encounters,
    filterGroups,
  }
}

/**
 * Takes a base workspace object and applies overrides to it
 *
 * @returns {object} workspace object with overrides applied
 */
function applyWorkspaceOverrides(workspace, overrides) {
  const overridenWorkspace = Object.assign({}, workspace)

  if (overrides.vessels !== undefined && overrides.vessels.length) {
    overrides.vessels.forEach((vessel, i) => {
      const [id, tilesetId, series] = vessel
      const newVessel = {
        id,
        tilesetId,
        visible: true,
        // hue ?
      }
      if (series !== undefined) {
        newVessel.series = series
      }
      overridenWorkspace.pinnedVessels.push(newVessel)

      // replace visible vessel by the 1st one
      if (i === 0) {
        overridenWorkspace.shownVessel = newVessel
      }
    })
  }

  if (overrides.view !== undefined) {
    const [zoom, longitude, latitude] = overrides.view
    overridenWorkspace.zoom = zoom
    overridenWorkspace.center = [latitude, longitude]
  }

  if (overrides.innerExtent !== undefined) {
    overridenWorkspace.timelineInnerDates = overrides.innerExtent.map((d) => new Date(d))
  }

  if (overrides.outerExtent !== undefined) {
    overridenWorkspace.timelineOuterDates = overrides.outerExtent.map((d) => new Date(d))
  }

  return overridenWorkspace
}

function loadWorkspace(data) {
  return (dispatch, getState) => {
    const { workspace, literals } = getState()
    let workspaceData
    if (data.workspace !== undefined) {
      workspaceData = processNewWorkspace(data, dispatch)
    } else {
      console.warn(
        'Legacy format detected. Support for legacy workspaces has been removed. Will reload with default workspace'
      )
      dispatch(
        setNotification({
          visible: true,
          type: 'warning',
          content: literals.legacy_workspace_warning,
        })
      )
      dispatch(setUrlWorkspaceId(null))
      dispatch(getWorkspace())
      return
    }
    if (workspace.workspaceOverride !== undefined) {
      workspaceData = applyWorkspaceOverrides(workspaceData, workspace.workspaceOverride)
    }
    dispatchActions(workspaceData, dispatch, getState)
  }
}

/**
 * Retrieve the workspace according to its ID and sets the zoom and
 * the center of the map, the timeline dates and the available layers
 *
 * @export getWorkspace
 * @returns {object}
 */
export function getWorkspace() {
  return (dispatch, getState) => {
    const state = getState()
    const urlWorkspaceId = state.workspace.urlWorkspaceId

    if (!urlWorkspaceId && !LOCAL_WORKSPACE) {
      dispatch(loadWorkspace(defaultWorkspace))
      return
    }

    let url

    if (!urlWorkspaceId && LOCAL_WORKSPACE) {
      url = LOCAL_WORKSPACE
    } else {
      url = `/workspaces/${urlWorkspaceId}`
    }

    fetchEndpoint(url)
      .then((res) => res.json())
      .then((data) => {
        dispatch(loadWorkspace(data))
      })
    // .catch((error) => {
    //   console.error('Error loading workspace: ', error.message)
    // })
  }
}

export { getWorkspace as default }
