import { push } from 'react-router-redux';
import {
  SET_ZOOM,
  SET_CENTER,
  SHARE_MODAL_OPEN,
  SET_WORKSPACE_ID,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  SET_LAYER_INFO_MODAL,
  SET_BASEMAP,
  SET_SUPPORT_MODAL_VISIBILITY,
  SET_LAYER_LIBRARY_MODAL_VISIBILITY
} from 'actions';
import { toggleVisibility } from 'actions/vesselInfo';

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
    if (getState().vesselInfo && getState().vesselInfo.details && getState().vesselInfo.details.isCluster === true) {
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
            layers: state.layers
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
    dispatch(setZoom(getState().map.zoom + 3));
    dispatch(setCenter(getState().map.vesselClusterCenter));
  };
}

export function setSupportModalVisibility(visibility) {
  return {
    type: SET_SUPPORT_MODAL_VISIBILITY,
    payload: visibility
  };
}

export function setLayerLibraryModalVisibility(visibility) {
  return {
    type: SET_LAYER_LIBRARY_MODAL_VISIBILITY,
    payload: visibility
  };
}
