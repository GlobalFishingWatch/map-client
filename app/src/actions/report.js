import {
  SHOW_POLYGON,
  CLEAR_POLYGON,
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  START_REPORT,
  DISCARD_REPORT,
  SET_REPORT_STATUS_SENT,
  SET_REPORT_STATUS_ERROR
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
        value: polygon.reportingId.toString()
      });
    });
    const body = JSON.stringify(payload);
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const options = {
      method: 'POST',
      body
    };
    options.headers = {
      Authorization: `Bearer ${state.user.token}`,
      'Content-Type': 'application/json'
    };
    fetch(`${state.map.tilesetUrl}/reports`, options).then((res) => {
      if (!res.ok) {
        throw new Error(`Error sending report ${res.status} - ${res.statusText}`);
      }
      return res;
    }).then(res => res.json())
      .then((data) => {
        dispatch({
          type: SET_REPORT_STATUS_SENT,
          payload: data.message
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_REPORT_STATUS_ERROR,
          payload: err.message
        });
      });
  };
}
