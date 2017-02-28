import {
  LAYER_TYPES,
  TIMELINE_DEFAULT_OUTER_START_DATE,
  TIMELINE_DEFAULT_OUTER_END_DATE,
  TIMELINE_DEFAULT_INNER_START_DATE,
  TIMELINE_DEFAULT_INNER_END_DATE,
  FLAGS,
  FLAGS_LANDLOCKED
} from 'constants';
import {
  SET_ZOOM,
  SET_CENTER,
  SET_OUTER_TIMELINE_DATES,
  SET_BASEMAP,
  SET_TILESET_URL,
  SET_TILESET_ID,
  SET_INNER_TIMELINE_DATES_FROM_WORKSPACE,
  SET_URL_WORKSPACE_ID,
  SET_WORKSPACE_ID
} from 'actions';
import { push } from 'react-router-redux';
import { initLayers } from 'actions/layers';
import { setFlagFilters } from 'actions/filters';
import { setPinnedVessels, loadRecentVesselHistory, addVessel } from 'actions/vesselInfo';
import calculateLayerId from 'util/calculateLayerId';
import { hexToHue } from 'util/hsvToRgb';
import extractTilesetFromURL from 'util/extractTileset';
import _ from 'lodash';
import { getSeriesGroupsFromVesselURL, getTilesetFromVesselURL } from 'util/handlePinnedVesselLegacyURL';


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
 * Update the URL according to the parameters present in the store
 *
 * @export updateURL
 * @returns {object}
 */
export function updateURL() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(push(`/map?workspace=${state.map.workspaceId}`));
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
        tileset: shownVesselData.tileset
      };
      if (shownVesselData.series !== null) {
        shownVessel.series = shownVesselData.series;
      }
    }

    const workspaceData = {
      workspace: {
        tileset: state.map.tilesetId,
        map: {
          center: state.map.center,
          zoom: state.map.zoom,
          layers: state.layers.workspaceLayers.filter(layer => layer.added)
        },
        pinnedVessels: state.vesselInfo.vessels.filter(e => e.pinned === true).map(e => ({
          seriesgroup: e.seriesgroup,
          tileset: e.tileset,
          title: e.title,
          hue: e.hue
        })),
        shownVessel,
        basemap: state.map.activeBasemap,
        timeline: {
          // We store the timestamp
          innerExtent: state.filters.timelineInnerExtent.map(e => +e),
          outerExtent: state.filters.timelineOuterExtent.map(e => +e)
        },
        filters: state.filters.flags
      }
    };

    fetch(`${MAP_API_ENDPOINT}/v1/workspaces`, {
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

  // We update the zoom level
  dispatch({
    type: SET_ZOOM, payload: workspaceData.zoom
  });

  // We update the center of the map
  dispatch({
    type: SET_CENTER, payload: workspaceData.center
  });

  // We update the dates of the timeline
  dispatch({
    type: SET_INNER_TIMELINE_DATES_FROM_WORKSPACE, payload: workspaceData.timelineInnerDates
  });

  dispatch({
    type: SET_OUTER_TIMELINE_DATES, payload: workspaceData.timelineOuterDates
  });

  dispatch({
    type: SET_BASEMAP, payload: workspaceData.basemap
  });

  dispatch({
    type: SET_TILESET_URL,
    payload: workspaceData.tilesetUrl
  });

  dispatch({
    type: SET_TILESET_ID,
    payload: workspaceData.tilesetId
  });

  dispatch(initLayers(workspaceData.layers, state.layerLibrary.layers)).then(() => {
    // we need heatmap layers headers to be loaded before loading track
    if (workspaceData.shownVessel) {
      dispatch(addVessel(workspaceData.shownVessel.tileset, workspaceData.shownVessel.seriesgroup, workspaceData.shownVessel.series));
    }
  });

  dispatch(setFlagFilters(workspaceData.filters));

  dispatch(loadRecentVesselHistory());

  dispatch(setPinnedVessels(workspaceData.pinnedVessels));
}

function processNewWorkspace(data) {
  const workspace = data.workspace;

  return {
    zoom: workspace.map.zoom,
    center: workspace.map.center,
    timelineInnerDates: workspace.timeline.innerExtent.map(d => new Date(d)),
    timelineOuterDates: workspace.timeline.outerExtent.map(d => new Date(d)),
    basemap: workspace.basemap,
    layers: workspace.map.layers,
    filters: workspace.filters,
    shownVessel: workspace.shownVessel,
    pinnedVessels: workspace.pinnedVessels,
    tilesetUrl: `${MAP_API_ENDPOINT}/v1/tilesets/${workspace.tileset}`,
    tilesetId: workspace.tileset
  };
}

function processLegacyWorkspace(data, dispatch) {
  const workspace = data;

  let startOuterDate = TIMELINE_DEFAULT_OUTER_START_DATE;
  let endOuterDate = TIMELINE_DEFAULT_OUTER_END_DATE;
  let startInnerDate = TIMELINE_DEFAULT_INNER_START_DATE;
  let endInnerDate = TIMELINE_DEFAULT_INNER_END_DATE;

  const serializedStartDate = workspace.state.time.__jsonclass__;

  if (serializedStartDate !== undefined && serializedStartDate[0] === 'Date' && workspace.state.timeExtent) {
    endOuterDate = new Date(serializedStartDate[1]);
    startOuterDate = new Date(endOuterDate.getTime() - workspace.state.timeExtent);
    startInnerDate = startOuterDate;
    endInnerDate = new Date(startInnerDate.getTime() + Math.min(workspace.state.timeExtent, 15778476000));
  }

  dispatch({
    type: SET_INNER_TIMELINE_DATES_FROM_WORKSPACE, payload: [startInnerDate, endInnerDate]
  });

  dispatch({
    type: SET_BASEMAP, payload: workspace.basemap
  });

  const layersData = workspace.map.animations.map(l => ({
    title: l.args.title,
    color: l.args.color,
    visible: l.args.visible,
    type: l.type,
    url: l.args.source.args.url
  }));
  layersData.forEach((layer) => {
    layer.id = calculateLayerId(layer);
  });

  const layers = layersData.filter(l => l.type !== LAYER_TYPES.VesselTrackAnimation);
  const vesselLayer = layers.filter(l => l.type === LAYER_TYPES.Heatmap)[0];
  const tilesetUrl = vesselLayer.url;

  const rawVesselLayer = workspace.map.animations.filter(l => l.type === LAYER_TYPES.Heatmap)[0];
  const filters = _.uniq(rawVesselLayer.args.selections.Flags.data.category)
    .filter(flag => (Array.prototype.hasOwnProperty.call(FLAGS, flag) && !_.includes(FLAGS_LANDLOCKED, FLAGS[flag])))
    .map(flag => ({
      flag
    }));

  const pinnedVessels = layersData.filter(l => l.type === 'VesselTrackAnimation').map(l => ({
    title: l.title,
    hue: hexToHue(l.color),
    seriesgroup: getSeriesGroupsFromVesselURL(l.url),
    tileset: getTilesetFromVesselURL(l.url)
  }));

  // TODO: load selected vessel
  const shownVessel = null;

  return {
    zoom: workspace.state.zoom,
    center: [workspace.state.lat, workspace.state.lon],
    timelineInnerDates: [startOuterDate, endOuterDate],
    timelineOuterDates: [startInnerDate, endInnerDate],
    basemap: workspace.basemap,
    layers,
    pinnedVessels,
    tilesetUrl,
    shownVessel,
    filters,
    tilesetID: extractTilesetFromURL(tilesetUrl)
  };
}

/**
 * Retrieve the workspace according to its ID and sets the zoom and
 * the center of the map, the timeline dates and the available layers
 *
 * @export getWorkspace
 * @param {null} workspaceId - workspace's ID to load
 * @returns {object}
 */
export function getWorkspace() {
  return (dispatch, getState) => {
    const state = getState();
    const workspaceId = state.map.urlWorkspaceId;

    const ID = workspaceId || DEFAULT_WORKSPACE;
    let url;

    if (!workspaceId && LOCAL_WORKSPACE) {
      url = LOCAL_WORKSPACE;
    } else {
      url = `${MAP_API_ENDPOINT}/v1/workspaces/${ID}`;
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
          workspaceData = processLegacyWorkspace(data, dispatch);
        }
        return dispatchActions(workspaceData, dispatch, getState);
      })
      .catch((error) => {
        console.error('Error loading workspace: ', error.message);
      });
  };
}

export { getWorkspace as default };
