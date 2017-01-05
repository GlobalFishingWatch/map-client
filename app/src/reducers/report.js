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
  layerTitle: null,
  layerId: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_POLYGON: {
      const currentPolygon = action.payload;
      return Object.assign({}, state, {
        currentPolygon
      });
    }
    case CLEAR_POLYGON: {
      return Object.assign({}, state, {
        currentPolygon: {}
      });
    }
    case ADD_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.push({
        id: action.payload.polygonId,
        name: action.payload.polygonName
      });
      const currentPolygon = Object.assign({}, state.currentPolygon, { isInReport: true });
      return Object.assign({}, state, { polygons, currentPolygon });
    }
    case DELETE_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.splice(action.payload.polygonIndex, 1);
      const currentPolygon = Object.assign({}, state.currentPolygon, { isInReport: false });
      return Object.assign({}, state, { polygons, currentPolygon });
    }
    case START_REPORT:
      return Object.assign({}, state, { polygons: [], layerId: action.payload.layerId, layerTitle: action.payload.layerTitle });
    case DISCARD_REPORT:
      return Object.assign({}, state, { polygons: [], layerId: null });


    default:
      return state;
  }
}
