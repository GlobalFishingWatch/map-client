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
import { REPORT_STATUS } from 'constants';

const initialState = {
  currentPolygon: {},
  polygons: [],
  polygonsIds: [],
  layerTitle: null,
  layerId: null,
  status: REPORT_STATUS.idle,
  statusText: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_POLYGON: {
      const polygonData = action.payload.polygonData;
      const id = polygonData.cartodb_id;

      let reportingId = polygonData.cartodb_id;
      if (polygonData.reporting_id !== undefined) {
        reportingId = polygonData.reporting_id;
      } else if (polygonData.reportingId !== undefined) {
        reportingId = polygonData.reportingId;
      }

      const name = (polygonData.name !== undefined) ? polygonData.name : polygonData.cartodb_id.toString();
      const isInReport = !!state.polygons.find(polygon => polygon.id === id);
      return Object.assign({}, state, {
        currentPolygon: {
          id,
          reportingId,
          name,
          latLng: action.payload.latLng,
          isInReport
        }
      });
    }

    case CLEAR_POLYGON: {
      return Object.assign({}, state, {
        currentPolygon: {}
      });
    }

    case ADD_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.push(Object.assign({}, state.currentPolygon));
      const currentPolygon = Object.assign({}, state.currentPolygon, { isInReport: true });
      return Object.assign({}, state, {
        polygons,
        currentPolygon,
        polygonsIds: polygons.map(polygon => polygon.id).sort()
      });
    }

    case DELETE_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.splice(action.payload.polygonIndex, 1);
      const currentPolygon = Object.assign({}, state.currentPolygon, { isInReport: false });
      return Object.assign({}, state, {
        polygons,
        currentPolygon,
        polygonsIds: polygons.map(polygon => polygon.id).sort()
      });
    }

    case START_REPORT:
      return Object.assign({}, state, {
        polygons: [],
        layerId: action.payload.layerId,
        reportId: action.payload.reportId,
        layerTitle: action.payload.layerTitle,
        status: REPORT_STATUS.idle,
        polygonsIds: [],
        currentPolygon: {}
      });
    case DISCARD_REPORT:
      return Object.assign({}, state, { polygons: [], polygonsIds: [], currentPolygon: {}, layerId: null });

    case SET_REPORT_STATUS_SENT:
      return Object.assign({}, state, { status: REPORT_STATUS.sent, statusText: action.payload });
    case SET_REPORT_STATUS_ERROR:
      return Object.assign({}, state, { status: REPORT_STATUS.error, statusText: action.payload });


    default:
      return state;
  }
}
