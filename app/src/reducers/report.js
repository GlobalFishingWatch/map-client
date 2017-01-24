import {
  SHOW_POLYGON,
  CLEAR_POLYGON,
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  START_REPORT,
  DISCARD_REPORT
} from 'actions';

const initialState = {
  currentPolygon: {},
  polygons: [],
  polygonsIds: [],
  layerTitle: null,
  layerId: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_POLYGON: {
      const polygonData = action.payload.polygonData;
      const id = polygonData.cartodb_id;
      const reportingId = (polygonData.reportingId !== undefined) ? polygonData.reportingId : polygonData.cartodb_id;
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
      return Object.assign({}, state, { polygons: [], layerId: action.payload.layerId, layerTitle: action.payload.layerTitle });
    case DISCARD_REPORT:
      return Object.assign({}, state, { polygons: [], layerId: null });


    default:
      return state;
  }
}
