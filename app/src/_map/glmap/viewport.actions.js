import { fitBounds, pixelsToWorld } from 'viewport-mercator-project';
import { updateHeatmapTilesFromViewport } from '../heatmap/heatmapTiles.actions';
import { onViewportChange } from '../module/module.actions';
import { CLUSTER_CLICK_ZOOM_INCREMENT } from '../../config'; // TODO MAP MODULE

export const SET_VIEWPORT = 'SET_VIEWPORT';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';
export const SET_ZOOM_INCREMENT = 'SET_ZOOM_INCREMENT';
export const SET_MOUSE_LAT_LONG = 'SET_MOUSE_LAT_LONG';
export const TRANSITION_END = 'TRANSITION_END';
export const SET_NATIVE_VIEWPORT = 'SET_NATIVE_VIEWPORT';

export const setViewport = viewport => (dispatch) => {
  dispatch({
    type: SET_VIEWPORT,
    payload: viewport
  });
  dispatch(updateHeatmapTilesFromViewport());
  dispatch(onViewportChange());
};

export const updateViewport = viewportUpdate => (dispatch) => {
  dispatch({
    type: UPDATE_VIEWPORT,
    payload: viewportUpdate
  });
  dispatch(updateHeatmapTilesFromViewport());
  dispatch(onViewportChange());
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
  dispatch(onViewportChange());
};


export const incrementZoom = () => (dispatch) => {
  dispatch(updateZoom(+1));
};

export const decrementZoom = () => (dispatch) => {
  dispatch(updateZoom(-1));
};

export const setMouseLatLong = (lat, long) => (dispatch) => {
  dispatch({
    type: SET_MOUSE_LAT_LONG,
    payload: [lat, long]
  });
  dispatch(onViewportChange());
};

export const transitionEnd = () => (dispatch) => {
  dispatch({
    type: TRANSITION_END
  });
  dispatch(updateHeatmapTilesFromViewport());
  dispatch(onViewportChange());
};

export const zoomIntoVesselCenter = (latitude, longitude) => (dispatch) => {
  dispatch(updateZoom(CLUSTER_CLICK_ZOOM_INCREMENT, latitude, longitude));
};

export const fitBoundsToTrack = trackBounds => (dispatch, getState) => {
  const state = getState();
  const vp = fitBounds({
    bounds: [[trackBounds.minLng, trackBounds.minLat], [trackBounds.maxLng, trackBounds.maxLat]],
    width: state.map.viewport.viewport.width,
    height: state.map.viewport.viewport.height,
    padding: 50
  });
  dispatch(updateZoom(null, vp.latitude, vp.longitude, vp.zoom));
};

export const exportNativeViewport = nativeViewport => (dispatch) => {
  const topLeftPx = [0, 0];
  const bottomRightPx = [nativeViewport.width, nativeViewport.height];

  // compute left and right offsets to deal with antimeridian issue
  const topLeftWorld = pixelsToWorld(topLeftPx, nativeViewport.pixelUnprojectionMatrix);
  const bottomRightWorld = pixelsToWorld(bottomRightPx, nativeViewport.pixelUnprojectionMatrix);
  const leftWorldScaled = topLeftWorld[0] / nativeViewport.scale;
  const rightWorldScaled = bottomRightWorld[0] / nativeViewport.scale;

  // lat/lon corners for miniglobe
  const northWest = nativeViewport.unproject(topLeftPx);
  const southEast = nativeViewport.unproject(bottomRightPx);
  const bounds = {
    north: northWest[1],
    south: southEast[1],
    west: northWest[0],
    east: southEast[0]
  };

  dispatch({
    type: SET_NATIVE_VIEWPORT,
    payload: {
      leftWorldScaled,
      rightWorldScaled,
      bounds
    }
  });
  dispatch(onViewportChange());
};
