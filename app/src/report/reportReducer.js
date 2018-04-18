import {
  SET_REPORT_POLYGON,
  CLEAR_REPORT_POLYGON,
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  START_REPORT,
  DISCARD_REPORT,
  TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY,
  SET_SUBSCRIPTION_STATUS_SENT,
  SET_SUBSCRIPTION_STATUS_ERROR,
  TOGGLE_REPORT_MODAL_VISIBILITY,
  UPDATE_SUBSCRIPTION_FREQUENCY
} from 'report/reportActions';
import { REPORT_STATUS } from 'constants';
import { SUBSCRIBE_DEFAULT_FREQUENCY } from '../config';

const initialState = {
  currentPolygon: {},
  polygons: [],
  polygonsIds: [],
  layerTitle: null,
  layerId: null,
  status: REPORT_STATUS.idle,
  statusText: '',
  showReportPanel: false,
  showSubscriptionModal: false,
  subscriptionFrequency: SUBSCRIBE_DEFAULT_FREQUENCY
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_REPORT_POLYGON: {
      const polygonData = action.payload.polygonData;

      // FIXME review/flatten directory API. Include field.
      const reportingId = [polygonData.reporting_id, polygonData.report_id, polygonData.reportingId, polygonData.cartodb_id]
        .find(e => e !== undefined);

      const name = [polygonData.reporting_name, polygonData.name, polygonData.cartodb_id]
        .find(e => e !== undefined);

      const isInReport = !!state.polygons.find(polygon => polygon.reportingId === reportingId);
      return Object.assign({}, state, {
        currentPolygon: {
          reportingId,
          name,
          isInReport
        }
      });
    }

    case UPDATE_SUBSCRIPTION_FREQUENCY: {
      return Object.assign({}, state, {
        subscriptionFrequency: action.payload.frequency
      });
    }

    case TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY: {
      return Object.assign({}, state, {
        showSubscriptionModal: action.payload.forceMode === null ? !state.showSubscriptionModal : action.payload.forceMode
      });
    }

    case TOGGLE_REPORT_MODAL_VISIBILITY: {
      return Object.assign({}, state, {
        showReportPanel: action.payload.forceMode === null ? !state.showReportPanel : action.payload.forceMode
      });
    }

    case ADD_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.push(Object.assign({}, state.currentPolygon));
      const currentPolygon = Object.assign({}, state.currentPolygon, { isInReport: true });
      return Object.assign({}, state, {
        polygons,
        currentPolygon,
        polygonsIds: polygons.map(polygon => polygon.reportingId).sort()
      });
    }

    case DELETE_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.splice(action.payload.polygonIndex, 1);
      const currentPolygon = Object.assign({}, state.currentPolygon, { isInReport: false });
      return Object.assign({}, state, {
        polygons,
        currentPolygon,
        polygonsIds: polygons.map(polygon => polygon.reportingId).sort()
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

    case CLEAR_REPORT_POLYGON:
      return Object.assign({}, state, { currentPolygon: {} });
    case DISCARD_REPORT:
      return Object.assign({}, state, { polygons: [], polygonsIds: [], currentPolygon: {}, layerId: null });
    case SET_SUBSCRIPTION_STATUS_SENT:
      return Object.assign({}, state, { status: REPORT_STATUS.sent, statusText: action.payload });
    case SET_SUBSCRIPTION_STATUS_ERROR:
      return Object.assign({}, state, { status: REPORT_STATUS.error, statusText: action.payload });


    default:
      return state;
  }
}
