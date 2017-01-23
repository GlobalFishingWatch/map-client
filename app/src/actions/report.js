import {
  SHOW_POLYGON,
  CLEAR_POLYGON,
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  START_REPORT,
  DISCARD_REPORT
} from 'actions';
import { toggleLayerVisibility } from 'actions/layers';
import { FLAGS } from 'constants';

export function showPolygon(polygonData, latLng) {
  return {
    type: SHOW_POLYGON,
    payload: {
      polygonData,
      latLng
    }
  };
}

export function clearPolygon() {
  return {
    type: CLEAR_POLYGON
  };
}

export function addCurrentPolygon() {
  return {
    type: ADD_REPORT_POLYGON
  };
}

export function deletePolygon(polygonIndex) {
  return {
    type: DELETE_REPORT_POLYGON,
    payload: {
      polygonIndex
    }
  };
}

export function toggleReportPolygon(polygonId) {
  return (dispatch, getState) => {
    const polygonIndex = getState().report.polygons.findIndex(polygon => polygon.id === polygonId);
    if (polygonIndex === -1) {
      dispatch(addCurrentPolygon());
    } else {
      dispatch(deletePolygon(polygonIndex));
    }
  };
}

export function startReport(layerId, layerTitle) {
  return (dispatch) => {
    dispatch(toggleLayerVisibility(layerId, true));
    dispatch(clearPolygon());
    dispatch({
      type: START_REPORT,
      payload: {
        layerId,
        layerTitle
      }
    });
  };
}

export function discardReport() {
  return (dispatch) => {
    dispatch(clearPolygon());
    dispatch({
      type: DISCARD_REPORT
    });
  };
}

export function toggleReport(layerId, layerTitle) {
  return (dispatch, getState) => {
    if (getState().report.layerId === layerId) {
      dispatch(discardReport());
    } else {
      dispatch(startReport(layerId, layerTitle));
    }
  };
}

export function sendReport() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.user.token) {
      console.warn('user is not authenticated');
      return;
    }

    // TODO hardcoded, will need to check w/ Skytruth for how to retrieve that properly
    const tileset = '801-tileset-nz2-tms';
    const url = `${MAP_API_ENDPOINT}/v1/tilesets/${tileset}/reports`;
    const payload = {
      from: state.filters.timelineInnerExtent[0].toISOString(),
      to: state.filters.timelineInnerExtent[1].toISOString()
    };
    const currentFlags = state.filters.flags.map(flag => flag.flag)
      .filter(flag => flag !== undefined)
      .map(flag => FLAGS[flag]);

    payload.flags = currentFlags;
    payload.regions = [];
    state.report.polygons.forEach((polygon) => {
      payload.regions.push({
        name: state.report.layerTitle,
        value: polygon.id
      });
    });
    const body = JSON.stringify({ report: payload });
    const options = {
      method: 'POST',
      body
    };
    if (state.user.token) {
      options.headers = {
        Authorization: `Bearer ${state.user.token}`
      };
    }
    fetch(url, options).then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
    }).then(res => res.json())
      .then((data) => {
        console.warn('success', data);
      });
  };
}
