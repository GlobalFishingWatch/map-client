import 'whatwg-fetch';
import {
  COLORS,
  COLOR_HUES,
  TRACK_DEFAULT_COLOR
} from 'config';
import { LAYER_TYPES } from 'constants';
import { setBasemap } from 'map/mapStyleActions';
import { updateViewport } from 'map/mapViewportActions';
import { initLayers } from 'layers/layersActions';
import { saveFilterGroup } from 'filters/filterGroupsActions';
import { setOuterTimelineDates, SET_INNER_TIMELINE_DATES_FROM_WORKSPACE, setSpeed } from 'filters/filtersActions';
import { setPinnedVessels, addVessel } from 'vesselInfo/vesselInfoActions';
import { loadRecentVesselsList } from 'recentVessels/recentVesselsActions';
import { setEncountersInfo } from 'encounters/encountersActions';
import { getKeyByValue, hueToClosestColor, hueToRgbHexString } from 'utils/colors';

export const SET_URL_WORKSPACE_ID = 'SET_URL_WORKSPACE_ID';
export const SET_WORKSPACE_ID = 'SET_WORKSPACE_ID';
export const SET_WORKSPACE_OVERRIDE = 'SET_WORKSPACE_OVERRIDE';
export const DELETE_WORKSPACE_ID = 'DELETE_WORKSPACE_ID';

export function setUrlWorkspaceId(workspaceId) {
  return {
    type: SET_URL_WORKSPACE_ID,
    payload: workspaceId
  };
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
    payload: workspaceId
  };
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
    payload: workspaceOverride
  };
}

/**
 * Delete the workspace id from the store
 *
 * @export deleteWorkspace
 * @returns {object}
 */
export function deleteWorkspace() {
  return {
    type: DELETE_WORKSPACE_ID
  };
}

/**
 * Update the URL according to the parameters present in the store
 *
 * @export updateURL
 * @returns {object}
 */
export function updateURL() {
  return (dispatch, getState) => {
    const newURL = `${window.location.origin}${window.location.pathname.replace(/\/$/g, '')}/?workspace=${getState().workspace.workspaceId}`;
    window.history.pushState({ path: newURL }, '', newURL);
  };
}

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
    const state = getState();
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    if (state.user.token) {
      headers.Authorization = `Bearer ${state.user.token}`;
    }

    const shownVesselData = state.vesselInfo.vessels.find(e => e.shownInInfoPanel === true);
    let shownVessel = null;
    if (shownVesselData !== undefined) {
      shownVessel = {
        seriesgroup: shownVesselData.seriesgroup,
        tilesetId: shownVesselData.tilesetId
      };
      if (shownVesselData.series !== null) {
        shownVessel.series = shownVesselData.series;
      }
    }

    const layers = state.layers.workspaceLayers.filter(layer => layer.added).map((layer) => {
      const newLayer = Object.assign({}, layer);
      if (newLayer.subtype === LAYER_TYPES.Encounters) {
        newLayer.type = LAYER_TYPES.Encounters;
      }
      // TODO Should we use a whitelist of fields instead ?
      delete newLayer.header;
      delete newLayer.subtype;
      return newLayer;
    });

    const workspaceData = {
      workspace: {
        map: {
          center: [state.mapViewport.viewport.latitude, state.mapViewport.viewport.longitude],
          //  Compatibility: A Mapbox GL JS zoom z means z-1
          zoom: state.mapViewport.viewport.zoom + 1,
          layers
        },
        pinnedVessels: state.vesselInfo.vessels.filter(e => e.pinned === true).map(e => ({
          seriesgroup: e.seriesgroup,
          tilesetId: e.tilesetId,
          title: e.title,
          visible: e.visible,
          color: e.color
        })),
        shownVessel,
        encounters: {
          seriesgroup: state.encounters.seriesgroup,
          tilesetId: state.encounters.tilesetId
        },
        basemap: state.mapStyle.activeBasemap,
        timeline: {
          // We store the timestamp
          innerExtent: state.filters.timelineInnerExtent.map(e => +e),
          outerExtent: state.filters.timelineOuterExtent.map(e => +e)
        },
        filters: state.filters.flags,
        timelineSpeed: state.filters.timelineSpeed,
        filterGroups: state.filterGroups.filterGroups
      }
    };

    fetch(`${V2_API_ENDPOINT}/workspaces`, {
      method: 'POST',
      headers,
      body: JSON.stringify(workspaceData)
    })
      .then(res => res.json())
      .then((data) => {
        dispatch(setWorkspaceId(data.id));
        dispatch(updateURL());
      })
      .catch(({ message }) => dispatch(errorAction(message)));
  };
}

function dispatchActions(workspaceData, dispatch, getState) {
  const state = getState();

  dispatch(updateViewport({
    // Mapbox branch compatibility: A Mapbox GL JS zoom z means z-1 on GMaps
    zoom: workspaceData.zoom - 1,
    latitude: workspaceData.center[0],
    longitude: workspaceData.center[1]
  }));

  // We update the dates of the timeline
  dispatch({
    type: SET_INNER_TIMELINE_DATES_FROM_WORKSPACE, payload: workspaceData.timelineInnerDates
  });

  dispatch(setOuterTimelineDates(workspaceData.timelineOuterDates));

  // Mapbox branch compatibility: 'Deep Blue' and 'High Contrast' basemaps have been removed, fallback to North Star
  let workspaceBasemap = workspaceData.basemap;
  if (state.mapStyle.basemaps.find(basemap => basemap.title === workspaceBasemap) === undefined) {
    workspaceBasemap = 'North Star';
  }
  dispatch(setBasemap(workspaceBasemap));

  dispatch(setSpeed(workspaceData.timelineSpeed));

  dispatch(initLayers(workspaceData.layers, state.layerLibrary.layers)).then(() => {
    // we need heatmap layers headers to be loaded before loading track
    if (workspaceData.shownVessel) {
      if (workspaceData.shownVessel.seriesgroup === undefined) {
        console.warn(`attempting to load vessel on tileset ${workspaceData.shownVessel.tilesetId} with no seriesgroup`);
      } else {
        dispatch(addVessel(workspaceData.shownVessel.tilesetId, workspaceData.shownVessel.seriesgroup, workspaceData.shownVessel.series));
      }
    }
    // Mapbox branch compatibility: track layers should have color, not hue
    workspaceData.pinnedVessels.forEach((pinnedVessel) => {
      if (pinnedVessel.color === undefined) {
        pinnedVessel.color = (pinnedVessel.hue !== undefined) ? hueToRgbHexString(pinnedVessel.hue, true) : TRACK_DEFAULT_COLOR;
      }
      delete pinnedVessel.hue;
    });

    dispatch(setPinnedVessels(workspaceData.pinnedVessels));

    if (workspaceData.encounters !== null && workspaceData.encounters !== undefined &&
        workspaceData.encounters.seriesgroup !== null && workspaceData.encounters.seriesgroup !== undefined) {
      const encountersLayer = workspaceData.layers.find(layer => layer.tilesetId === workspaceData.encounters.tilesetId);
      const infoUrl = encountersLayer.header.endpoints.info;
      dispatch(setEncountersInfo(workspaceData.encounters.seriesgroup, workspaceData.encounters.tilesetId, infoUrl));
    }
  });

  dispatch(loadRecentVesselsList());

  if (workspaceData.filterGroups) {
    workspaceData.filterGroups.forEach((filterGroup) => {
      // Mapbox branch compatibility: filter groups are not saved as color literals anymore (ie 'pink'). Convert to hue.
      if (filterGroup.color !== undefined) {
        const colorLiteralFromHex = getKeyByValue(COLORS, filterGroup.color);
        filterGroup.hue = COLOR_HUES[colorLiteralFromHex || filterGroup.color];
        delete filterGroup.color;
      }
      dispatch(saveFilterGroup(filterGroup));
    });
  }

}

/**
 * Convert filters to filterGroups only with the filter flag in the AIS layer
 *
 * @param {array} filters
 * @return {array} filterGroups
 */
const filtersToFilterGroups = (filters, layers) => {
  if (filters === undefined ||
    (filters.length === 1 && Object.keys(filters[0]).length !== 0)) return []; // remove empty filters
  const checkedLayers = {};
  layers.filter(layer => layer.type === LAYER_TYPES.Heatmap).forEach((layer) => {
    checkedLayers[layer.id] = true;
  });
  const filterGroups = [];
  filters.forEach((filter, index) => {
    if (filter.flag) {
      filterGroups.push({
        checkedLayers,
        color: hueToClosestColor(filter.hue) || Object.keys(COLORS)[0],
        filterValues: { flag: [parseInt(filter.flag, 10)] },
        label: `Filter ${index + 1}`,
        visible: true
      });
    } else if (filter.category) {
      filterGroups.push({
        checkedLayers,
        color: hueToClosestColor(filter.hue) || Object.keys(COLORS)[0],
        filterValues: { flag: [parseInt(filter.category, 10)] },
        label: `Filter ${index + 1}`,
        visible: true
      });
    }
  });
  return filterGroups;
};

function processNewWorkspace(data) {
  const workspace = data.workspace;
  let filterGroups = workspace.filterGroups || [];
  filterGroups = filterGroups.concat(filtersToFilterGroups(workspace.filters, workspace.map.layers));
  return {
    zoom: workspace.map.zoom,
    center: workspace.map.center,
    timelineInnerDates: workspace.timeline.innerExtent.map(d => new Date(d)),
    timelineOuterDates: workspace.timeline.outerExtent.map(d => new Date(d)),
    timelineSpeed: workspace.timelineSpeed,
    basemap: workspace.basemap,
    layers: workspace.map.layers,
    filters: workspace.filters,
    shownVessel: workspace.shownVessel,
    pinnedVessels: workspace.pinnedVessels,
    encounters: workspace.encounters,
    filterGroups
  };
}

/**
 * Takes a base workspace object and applies overrides to it
 *
 * @returns {object} workspace object with overrides applied
 */
function applyWorkspaceOverrides(workspace, overrides) {
  const overridenWorkspace = Object.assign({}, workspace);

  if (overrides.vessels !== undefined && overrides.vessels.length) {
    overrides.vessels.forEach((vessel, i) => {
      const [seriesgroup, tilesetId, series] = vessel;
      const newVessel = {
        seriesgroup,
        tilesetId,
        visible: true
        // hue ?
      };
      if (series !== undefined) {
        newVessel.series = series;
      }
      overridenWorkspace.pinnedVessels.push(newVessel);

      // replace visible vessel by the 1st one
      if (i === 0) {
        overridenWorkspace.shownVessel = newVessel;
      }
    });
  }

  if (overrides.view !== undefined) {
    const [zoom, longitude, latitude] = overrides.view;
    overridenWorkspace.zoom = zoom;
    overridenWorkspace.center = [latitude, longitude];
  }

  if (overrides.innerExtent !== undefined) {
    overridenWorkspace.timelineInnerDates = overrides.innerExtent.map(d => new Date(d));
  }

  if (overrides.outerExtent !== undefined) {
    overridenWorkspace.timelineOuterDates = overrides.outerExtent.map(d => new Date(d));
  }

  return overridenWorkspace;
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
    const state = getState();
    const workspaceId = state.workspace.urlWorkspaceId;

    const ID = workspaceId || DEFAULT_WORKSPACE;
    let url;

    if (!workspaceId && LOCAL_WORKSPACE) {
      url = LOCAL_WORKSPACE;
    } else {
      url = `${V2_API_ENDPOINT}/workspaces/${ID}`;
    }

    const options = {};
    if (state.user.token) {
      options.headers = {
        Authorization: `Bearer ${state.user.token}`
      };
    }

    fetch(url, options)
      .then(res => res.json())
      .then((data) => {
        let workspaceData;
        if (data.workspace !== undefined) {
          workspaceData = processNewWorkspace(data, dispatch);
        } else {
          console.warn('Legacy format detected. Support for legacy workspaces has been removed. Will reload with default workspace');
          dispatch(setUrlWorkspaceId(null));
          dispatch(getWorkspace());
          return;
        }
        if (state.workspace.workspaceOverride !== undefined) {
          workspaceData = applyWorkspaceOverrides(workspaceData, state.workspace.workspaceOverride);
        }
        return dispatchActions(workspaceData, dispatch, getState);
      })
      .catch((error) => {
        console.error('Error loading workspace: ', error.message);
      });
  };
}

export { getWorkspace as default };
