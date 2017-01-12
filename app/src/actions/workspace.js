import { LAYER_TYPES } from 'constants';
import {
  SET_LAYERS, SET_ZOOM, SET_CENTER, SET_INNER_TIMELINE_DATES, SET_OUTER_TIMELINE_DATES, SET_BASEMAP, SET_TILESET_URL
} from 'actions';
import { initLayers } from 'actions/layers';

function processNewWorkspace(data, dispatch) {
  const workspace = data.workspace;

  // We update the zoom level
  dispatch({
    type: SET_ZOOM, payload: workspace.map.zoom
  });

  // We update the center of the map
  dispatch({
    type: SET_CENTER, payload: workspace.map.center
  });

  // We update the dates of the timeline
  dispatch({
    type: SET_INNER_TIMELINE_DATES, payload: workspace.timeline.innerExtent.map(d => new Date(d))
  });

  dispatch({
    type: SET_OUTER_TIMELINE_DATES, payload: workspace.timeline.outerExtent.map(d => new Date(d))
  });

  dispatch({
    type: SET_BASEMAP, payload: workspace.basemap
  });

  const vesselLayer = workspace.map.layers
    .filter(l => l.type === LAYER_TYPES.ClusterAnimation)[0];
  const tilesetUrl = vesselLayer.source.args.url;

  // TODO this is only used by vesselInfo, but the data is inside a layer
  // review wit SkyTruth
  dispatch({
    type: SET_TILESET_URL, payload: tilesetUrl
  });

  dispatch(initLayers(workspace.map.layers));
}

function processLegacyWorkspace(data, dispatch) {
  const workspace = data;

  // We update the zoom level
  dispatch({
    type: SET_ZOOM, payload: workspace.state.zoom
  });

  // We update the center of the map
  dispatch({
    type: SET_CENTER, payload: [workspace.state.lat, workspace.state.lon]
  });

  if (workspace.timeline) {
    // We update the dates of the timeline
    if (workspace.timeline.innerExtent) {
      dispatch({
        type: SET_INNER_TIMELINE_DATES, payload: workspace.timeline.innerExtent.map(d => new Date(d))
      });
    }

    if (workspace.timeline.outerExtent) {
      dispatch({
        type: SET_OUTER_TIMELINE_DATES, payload: workspace.timeline.outerExtent.map(d => new Date(d))
      });
    }
  }

  dispatch({
    type: SET_BASEMAP, payload: workspace.basemap
  });

  const layers = workspace.map.animations.map(l => Object.assign({}, l.args, { type: l.type }));
  const vesselLayer = layers.filter(l => l.type === LAYER_TYPES.ClusterAnimation)[0];
  const tilesetUrl = vesselLayer.source.args.url;

  // TODO this is only used by vesselInfo, but the data is inside a layer
  // review wit SkyTruth
  dispatch({
    type: SET_TILESET_URL, payload: tilesetUrl
  });

  dispatch(initLayers(layers));
}

/**
 * Retrieve the workspace according to its ID and sets the zoom and
 * the center of the map, the timeline dates and the available layers
 *
 * @export getWorkspace
 * @param {string} workspaceId - workspace's ID to load
 * @returns {object}
 */
export function loadWorkspace(workspaceId) {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.user.token) {
      dispatch({
        type: SET_LAYERS, payload: []
      });
      return;
    }

    const ID = workspaceId || DEFAULT_WORKSPACE;
    let url;

    if (!workspaceId && LOCAL_WORKSPACE) {
      url = LOCAL_WORKSPACE;
    } else {
      url = `${MAP_API_ENDPOINT}/v1/workspaces/${ID}`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${state.user.token}`
      }
    }).then(res => res.json())
      .then(data => {
        if (data.workspace !== undefined) {
          return processNewWorkspace(data, dispatch);
        }
        return processLegacyWorkspace(data, dispatch);
      });
  };
}

export function getWorkspace(workspaceId) {
  return loadWorkspace(workspaceId);
}
