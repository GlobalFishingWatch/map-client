import {
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  SEND_REPORT,
  DISCARD_REPORT
} from 'actions';


export function addPolygon(polygonId, polygonName) {
  return {
    type: ADD_REPORT_POLYGON,
    payload: {
      polygonId,
      polygonName
    }
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

export function toggleReportPolygon(polygonId, polygonName) {
  return (dispatch, getState) => {
    const polygonIndex = getState().report.polygons.findIndex(polygon => polygon.id === polygonId);
    if (polygonIndex === -1) {
      dispatch(addPolygon(polygonId, polygonName));
    } else {
      dispatch(deletePolygon(polygonIndex));
    }
  };
}

export function discardReport() {
  return {
    type: DISCARD_REPORT
  };
}
