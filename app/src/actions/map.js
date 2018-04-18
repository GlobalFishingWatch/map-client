import { clearVesselInfo } from 'vesselInfo/vesselInfoActions';
import { trackCenterTile } from 'analytics/analyticsActions';
import { ANALYTICS_TILE_COORDS_SCALE, ANALYTICS_TRACK_DRAG_FROM_ZOOM } from 'config';

export const SET_LAYER_MANAGEMENT_MODAL_VISIBILITY = 'SET_LAYER_MANAGEMENT_MODAL_VISIBILITY';
export const SET_CENTER = 'SET_CENTER';
export const SET_LOADING = 'SET_LOADING';
export const SET_LOADERS = 'SET_LOADERS';
export const SET_CENTER_TILE = 'SET_CENTER_TILE';
export const SET_LAYER_INFO_MODAL = 'SET_LAYER_INFO_MODAL';
export const DELETE_WORKSPACE_ID = 'DELETE_WORKSPACE_ID';

export function setZoom(zoom, latLng = null) {
  return (dispatch, getState) => {
    if (getState().vesselInfo && getState().vesselInfo.details &&
      (getState().vesselInfo.details.isEmpty === true || getState().vesselInfo.details.isCluster === true)) {
      dispatch(clearVesselInfo());
    }
  };
}

export function setCenter(center, centerWorld) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CENTER,
      payload: center
    });


    if (centerWorld !== undefined && getState().map.zoom >= ANALYTICS_TRACK_DRAG_FROM_ZOOM) {
      const x = Math.floor(centerWorld.x * (ANALYTICS_TILE_COORDS_SCALE / 256));
      const y = Math.floor(centerWorld.y * (ANALYTICS_TILE_COORDS_SCALE / 256));

      const prevCenterTile = getState().map.centerTile;

      if (prevCenterTile.x !== x && prevCenterTile.x !== y) {
        dispatch({
          type: SET_CENTER_TILE,
          payload: { x, y }
        });
        dispatch(trackCenterTile(x, y));
      }
    }
  };
}

export function addLoader(loaderId) {
  return (dispatch, getState) => {
    const loaders = Object.assign({}, getState().map.loaders, { [loaderId]: true });
    dispatch({
      type: SET_LOADERS,
      payload: loaders
    });
    dispatch({
      type: SET_LOADING,
      payload: true
    });
  };
}

export function removeLoader(loaderId) {
  return (dispatch, getState) => {
    const loaders = Object.assign({}, getState().map.loaders);
    delete loaders[loaderId];
    dispatch({
      type: SET_LOADERS,
      payload: loaders
    });
    if (!Object.keys(loaders).length) {
      dispatch({
        type: SET_LOADING,
        payload: false
      });
    }
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


export function openTimebarInfoModal() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(setLayerInfoModal(
      {
        open: true,
        info: {
          title: 'Worldwide Fishing Hours',
          description: state.literals.fishing_hours_description
        }
      }
    ));
  };
}

export function setLayerManagementModalVisibility(visibility) {
  return {
    type: SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
    payload: visibility
  };
}
