import { push } from 'react-router-redux';
import {
  SET_LAYERS,
  SET_ZOOM,
  SET_CENTER,
  TOGGLE_LAYER_VISIBILITY,
  SET_LAYER_OPACITY,
  SET_INNER_TIMELINE_DATES,
  SET_OUTER_TIMELINE_DATES,
  SET_FLAG_FILTER,
  SHARE_MODAL_OPEN,
  SET_WORKSPACE_ID,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  SET_LAYER_INFO_MODAL,
  UPDATE_VESSEL_TRANSPARENCY,
  UPDATE_VESSEL_COLOR,
  SET_BASEMAP,
  SET_TILESET_URL
} from 'actions';
import { toggleVisibility } from 'actions/vesselInfo';

export function toggleLayerVisibility(layer) {
  return {
    type: TOGGLE_LAYER_VISIBILITY,
    payload: layer
  };
}

export function setBasemap(basemap) {
  return {
    type: SET_BASEMAP,
    payload: basemap
  };
}

export function setZoom(zoom) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_ZOOM,
      payload: zoom
    });
    if (getState().vesselInfo.details.isCluster === true) {
      dispatch(toggleVisibility(false));
    }
  };
}
export function setCenter(center) {
  return {
    type: SET_CENTER,
    payload: center
  };
}

export function setLayerOpacity(opacity, layer) {
  return {
    type: SET_LAYER_OPACITY,
    payload: {
      layer,
      opacity
    }
  };
}

export function updateVesselTransparency(transparency) {
  return {
    type: UPDATE_VESSEL_TRANSPARENCY,
    payload: parseInt(transparency, 10)
  };
}

export function updateVesselColor(color) {
  return {
    type: UPDATE_VESSEL_COLOR,
    payload: color
  };
}

/**
 * Retrieve the workspace according to its ID and sets the zoom and
 * the center of the map, the timeline dates and the available layers
 *
 * @export getWorkspace
 * @param {string} workspaceId - workspace's ID to load
 * @returns {object}
 */
export function getWorkspace(workspaceId) {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.user.token) {
      dispatch({
        type: SET_LAYERS,
        payload: []
      });
      return;
    }

    const ID = workspaceId || DEFAULT_WORKSPACE;
    let url;

    if (!workspaceId && !!USE_LOCAL_WORKSPACE) {
      url = '/workspace.json';
    } else {
      url = `${MAP_API_ENDPOINT}/v1/workspaces/${ID}`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${state.user.token}`
      }
    }).then(res => res.json())
      .then(data => {
        const workspace = data.workspace;

        // We update the zoom level
        dispatch({
          type: SET_ZOOM,
          payload: workspace.map.zoom
        });

        // We update the center of the map
        dispatch({
          type: SET_CENTER,
          payload: workspace.map.center
        });

        // We update the dates of the timeline
        dispatch({
          type: SET_INNER_TIMELINE_DATES,
          payload: workspace.timeline.innerExtent.map(d => new Date(d))
        });

        dispatch({
          type: SET_OUTER_TIMELINE_DATES,
          payload: workspace.timeline.outerExtent.map(d => new Date(d))
        });

        dispatch({
          type: SET_FLAG_FILTER,
          payload: workspace.flag
        });

        dispatch({
          type: SET_BASEMAP,
          payload: workspace.basemap
        });

        // We update the layers
        const allowedLayerTypes = ['CartoDBAnimation', 'CartoDBBasemap', 'ClusterAnimation'];
        const layers = workspace.map.layers
          .filter(l => allowedLayerTypes.indexOf(l.type) !== -1);

        const vesselLayer = workspace.map.layers
          .filter(l => l.type === 'ClusterAnimation')[0];
        const tilesetUrl = vesselLayer.source.args.url;

        dispatch({
          type: SET_TILESET_URL,
          payload: tilesetUrl
        });

        // parses opacity attribute
        layers.forEach((layer) => {
          const l = layer;
          if (!!layer.opacity) {
            l.opacity = parseFloat(layer.opacity);
          } else {
            l.opacity = 1;
          }
        });

        dispatch({
          type: SET_LAYERS,
          payload: layers
        });
      })
      .catch(err => console.warn(`Unable to fetch the layers: ${err}`));
  };
}

/**
 * Open or close the share modal
 *
 * @export openShareModal
 * @param {boolean} open - true to open, false to close
 * @returns {object}
 */
export function openShareModal(open) {
  return {
    type: SHARE_MODAL_OPEN,
    payload: open
  };
}

/**
 * Set the error to display within the share modal
 *
 * @export setShareModalError
 * @param {string} error - message to display
 * @returns {object}
 */
export function setShareModalError(error) {
  return {
    type: SET_SHARE_MODAL_ERROR,
    payload: error
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


    fetch(`${MAP_API_ENDPOINT}/v1/workspaces`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        workspace: {
          map: {
            center: state.map.center,
            zoom: state.map.zoom,
            layers: state.map.layers
          },
          basemap: state.map.activeBasemap,
          timeline: {
            // We store the timestamp
            innerExtent: state.filters.timelineInnerExtent.map(e => +e),
            outerExtent: state.filters.timelineOuterExtent.map(e => +e)
          },
          flag: state.filters.flag
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        dispatch(setWorkspaceId(data.id));
        dispatch(updateURL());
      })
      .catch(({ message }) => dispatch(errorAction(message)));
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

export function setLayerInfoModal(modalParams) {
  return {
    type: SET_LAYER_INFO_MODAL,
    payload: modalParams
  };
}

export function zoomIntoVesselCenter() {
  return (dispatch, getState) => {
    dispatch(setZoom(getState().map.zoom + 2));
    dispatch(setCenter(getState().map.vesselClusterCenter));
  };
}
