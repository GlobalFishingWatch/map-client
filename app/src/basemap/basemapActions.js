import { updateMapStyle } from 'map/mapStyleActions';

export const INIT_BASEMAP = 'INIT_BASEMAP';
export const UPDATE_BASEMAP_LAYER = 'UPDATE_BASEMAP_LAYER';

export const initBasemap = (workspaceBasemap, workspaceBasemapOptions) => (dispatch, getState) => {
  dispatch({
    type: INIT_BASEMAP,
    payload: { workspaceBasemap, workspaceBasemapOptions }
  });
  dispatch(updateMapStyle());
};

export const showBasemap = id => (dispatch) => {
  dispatch({
    type: UPDATE_BASEMAP_LAYER,
    payload: {
      id,
      visible: true
    }
  });
  dispatch(updateMapStyle());
};

export const toggleBasemapOption = id => (dispatch, getState) => {
  const basemapOption = getState().basemap.basemapLayers.find(b => b.id === id);
  dispatch({
    type: UPDATE_BASEMAP_LAYER,
    payload: {
      id,
      visible: !(basemapOption.visible === true)
    }
  });
  dispatch(updateMapStyle());
};
