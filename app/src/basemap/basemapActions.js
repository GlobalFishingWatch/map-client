export const INIT_BASEMAP = 'INIT_BASEMAP';
export const UPDATE_BASEMAP_LAYER = 'UPDATE_BASEMAP_LAYER';

export const initBasemap = (workspaceBasemap, workspaceBasemapOptions) => ({
  type: INIT_BASEMAP,
  payload: { workspaceBasemap, workspaceBasemapOptions }
});

export const showBasemap = id => ({
  type: UPDATE_BASEMAP_LAYER,
  payload: {
    id,
    visible: true
  }
});

export const toggleBasemapOption = id => (dispatch, getState) => {
  const basemapOption = getState().basemap.basemapLayers.find(b => b.id === id);
  dispatch({
    type: UPDATE_BASEMAP_LAYER,
    payload: {
      id,
      visible: !(basemapOption.visible === true)
    }
  });
};
