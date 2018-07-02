import { updateMapStyle } from 'map/mapStyleActions';

export const UPDATE_BASEMAP_LAYERS = 'UPDATE_BASEMAP_LAYERS';
export const UPDATE_BASEMAP_LAYER = 'UPDATE_BASEMAP_LAYER';

export const initBasemap = (basemap, basemapOptions) => (dispatch, getState) => {
  // Mapbox branch compatibility:
  // 'satellite' was name 'hybrid'
  // 'Deep Blue' and 'High Contrast' basemaps have been removed, fallback to North Star
  let finalBasemapId = (basemap === 'hybrid') ? 'satellite' : basemap;
  if (getState().basemap.basemapLayers.find(b => b.id === finalBasemapId) === undefined) {
    finalBasemapId = 'north-star';
  }

  const updates = {};
  updates[finalBasemapId] = true;
  basemapOptions.forEach((basemapOption) => {
    updates[basemapOption] = true;
  });

  dispatch({
    type: UPDATE_BASEMAP_LAYERS,
    payload: updates
  });
  dispatch(updateMapStyle());
};

export const updateBasemap = (id, visible) => (dispatch) => {
  dispatch({
    type: UPDATE_BASEMAP_LAYER,
    payload: {
      id,
      visible
    }
  });
  dispatch(updateMapStyle());
};
