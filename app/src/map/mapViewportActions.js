import { fitBounds } from 'viewport-mercator-project';
import bbox from '@turf/bbox';
import { updateHeatmapTilesFromViewport } from 'activityLayers/heatmapTilesActions';
import { CLUSTER_CLICK_ZOOM_INCREMENT } from 'config';

export const SET_VIEWPORT = 'SET_VIEWPORT';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';
export const SET_ZOOM_INCREMENT = 'SET_ZOOM_INCREMENT';
export const SET_MAX_ZOOM = 'SET_MAX_ZOOM';
export const SET_MOUSE_LAT_LONG = 'SET_MOUSE_LAT_LONG';
export const TRANSITION_END = 'TRANSITION_END';

export const setViewport = viewport => (dispatch) => {
  dispatch({
    type: SET_VIEWPORT,
    payload: viewport
  });
  dispatch(updateHeatmapTilesFromViewport());
};

export const updateViewport = viewportUpdate => (dispatch) => {
  dispatch({
    type: UPDATE_VIEWPORT,
    payload: viewportUpdate
  });
  dispatch(updateHeatmapTilesFromViewport());
};

const updateZoom = (increment, latitude, longitude, zoom = null) => (dispatch) => {
  dispatch({
    type: SET_ZOOM_INCREMENT,
    payload: {
      increment,
      latitude,
      longitude,
      zoom
    }
  });
  dispatch(updateHeatmapTilesFromViewport());
};


export const incrementZoom = () => (dispatch) => {
  dispatch(updateZoom(+1));
};

export const decrementZoom = () => (dispatch) => {
  dispatch(updateZoom(-1));
};


export const setMaxZoom = maxZoom => ({
  type: SET_MAX_ZOOM,
  payload: maxZoom
});

export const setMouseLatLong = (lat, long) => ({
  type: SET_MOUSE_LAT_LONG,
  payload: { lat, long }
});

export const transitionEnd = () => (dispatch) => {
  dispatch({
    type: TRANSITION_END
  });
  dispatch(updateHeatmapTilesFromViewport());
};

export const zoomIntoVesselCenter = (latitude, longitude) => (dispatch) => {
  dispatch(updateZoom(CLUSTER_CLICK_ZOOM_INCREMENT, latitude, longitude));
};

export const fitGeoJSONBounds = geoJSON => (dispatch, getState) => {
  const [minX, minY, maxX, maxY] = bbox(geoJSON);
  const vp = fitBounds({
    bounds: [[minX, minY], [maxX, maxY]],
    width: getState().mapViewport.viewport.width,
    height: getState().mapViewport.viewport.height,
    padding: 50
  });
  dispatch(updateZoom(null, vp.latitude, vp.longitude, vp.zoom));
};
