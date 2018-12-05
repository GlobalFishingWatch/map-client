import { updateHeatmapTilesFromViewport } from '../heatmap/heatmapTiles.actions';

export const INIT_MODULE = 'INIT_MODULE';
export const START_LOADER = 'START_LOADER';
export const COMPLETE_LOADER = 'COMPLETE_LOADER';

export const initModule = props => (dispatch) => {
  dispatch({
    type: INIT_MODULE,
    payload: props
  });
  // TODO MAP MODULE this has to be triggered once to save tile coords - do it at init map viewport?
  dispatch(updateHeatmapTilesFromViewport(true));
};

export const startLoader = (dispatch, state) => {
  const loaderId = new Date().getTime();
  dispatch({
    type: START_LOADER,
    payload: loaderId
  });
  if (state.map.module.onLoadStart !== undefined) {
    state.map.module.onLoadStart();
  }
  return loaderId;
};

export const completeLoader = loaderId => (dispatch, getState) => {
  const state = getState();
  const loaders = Object.assign({}, state.map.module.loaders);
  dispatch({
    type: COMPLETE_LOADER,
    payload: loaderId
  });
  if (!loaders.length && state.map.module.onLoadComplete !== undefined) {
    state.map.module.onLoadComplete();
  }
};

export const onViewportChange = () => (dispatch, getState) => {
  const state = getState();
  const callback = state.map.module.onViewportChange;

  if (callback === undefined) {
    return;
  }
  const viewport = state.map.viewport;

  callback({
    zoom: viewport.viewport.zoom,
    center: [viewport.viewport.latitude, viewport.viewport.longitude],
    bounds: viewport.bounds,
    canZoomIn: viewport.canZoomIn,
    canZoomOut: viewport.canZoomOut,
    mouseLatLong: viewport.mouseLatLong
  });
};

