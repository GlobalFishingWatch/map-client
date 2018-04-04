import { updateHeatmapTilesFromViewport } from 'activityLayers/heatmapTilesActions';

export const SET_VIEWPORT = 'SET_VIEWPORT';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';
export const SET_ZOOM_INCREMENT = 'SET_ZOOM_INCREMENT';
export const SET_MAX_ZOOM = 'SET_MAX_ZOOM';
export const SET_MOUSE_LAT_LONG = 'SET_MOUSE_LAT_LONG';
export const TRANSITION_END = 'TRANSITION_END';

export const setViewport = (viewport) => (dispatch) => {
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

const updateZoom = increment => (dispatch) => {
  dispatch({
    type: SET_ZOOM_INCREMENT,
    payload: increment
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
