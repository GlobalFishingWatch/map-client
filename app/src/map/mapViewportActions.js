export const SET_VIEWPORT = 'SET_VIEWPORT';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';
export const SET_ZOOM_INCREMENT = 'SET_ZOOM_INCREMENT';
export const SET_MAX_ZOOM = 'SET_MAX_ZOOM';
export const SET_MOUSE_LAT_LONG = 'SET_MOUSE_LAT_LONG';

export const setViewport = viewport => ({
  type: SET_VIEWPORT,
  payload: viewport
});

export const updateViewport = viewportUpdate => ({
  type: UPDATE_VIEWPORT,
  payload: viewportUpdate
});

export const incrementZoom = () => ({
  type: SET_ZOOM_INCREMENT,
  payload: +1
});

export const decrementZoom = () => ({
  type: SET_ZOOM_INCREMENT,
  payload: -1
});

export const setMaxZoom = maxZoom => ({
  type: SET_MAX_ZOOM,
  payload: maxZoom
});

export const setMouseLatLong = (lat, long) => ({
  type: SET_MOUSE_LAT_LONG,
  payload: { lat, long }
});

