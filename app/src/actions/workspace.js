import {
  LAYER_TYPES,
  TIMELINE_DEFAULT_OUTER_START_DATE,
  TIMELINE_DEFAULT_OUTER_END_DATE,
  TIMELINE_DEFAULT_INNER_START_DATE,
  TIMELINE_DEFAULT_INNER_END_DATE
} from 'constants';
import { SET_ZOOM, SET_CENTER, SET_INNER_TIMELINE_DATES, SET_OUTER_TIMELINE_DATES, SET_BASEMAP, SET_TILESET_URL } from 'actions';
import { initLayers } from 'actions/layers';
import { setFlagFilters } from 'actions/filters';
import { setPinnedVessels } from 'actions/vesselInfo';
import calculateLayerId from 'util/calculateLayerId';

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
    type: SET_INNER_TIMELINE_DATES, payload: workspaceData.timelineInnerDates
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

  dispatch(initLayers(workspaceData.layers, state.layerLibrary.layers));

  dispatch(setFlagFilters(workspaceData.flagFilters));

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
    flagFilters: workspace.map.flagFilters,
    pinnedVessels: workspace.pinnedVessels,
    tilesetUrl: `${MAP_API_ENDPOINT}/v1/tilesets/${workspace.tileset}`
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
    type: SET_INNER_TIMELINE_DATES, payload: [startInnerDate, endInnerDate]
  });

  dispatch({
    type: SET_BASEMAP, payload: workspace.basemap
  });

  const layers = workspace.map.animations.map(l => ({
    title: l.args.title,
    color: l.args.color,
    visible: l.args.visible,
    type: l.type,
    url: l.args.source.args.url
  }));
  layers.forEach((layer) => {
    layer.id = calculateLayerId(layer);
  });
  const vesselLayer = layers.filter(l => l.type === LAYER_TYPES.Heatmap)[0];
  const tilesetUrl = vesselLayer.url;

  // TODO: implement legacy workspace loading of pinned vessels
  const pinnedVessels = [];

  return {
    zoom: workspace.state.zoom,
    center: [workspace.state.lat, workspace.state.lon],
    timelineInnerDates: [startOuterDate, endOuterDate],
    timelineOuterDates: [startInnerDate, endInnerDate],
    basemap: workspace.basemap,
    layers,
    pinnedVessels,
    tilesetUrl
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
export function getWorkspace(workspaceId = null) {
  return (dispatch, getState) => {
    const state = getState();

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
      });
  };
}

export { getWorkspace as default };
