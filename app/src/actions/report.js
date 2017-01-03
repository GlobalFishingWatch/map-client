import {
  TOGGLE_REPORT_POLYGON,
  SEND_REPORT,
  DISCARD_REPORT
} from 'actions';

export function toggleReportPolygon(polygonId, polygonName) {
  return {
    type: TOGGLE_REPORT_POLYGON,
    payload: {
      polygonId,
      polygonName
    }
  };
}
