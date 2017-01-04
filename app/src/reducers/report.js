import {
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  SEND_REPORT,
  START_REPORT,
  DISCARD_REPORT
} from 'actions';

const initialState = {
  polygons: [],
  layerTitle: null,
  layerId: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.push({
        id: action.payload.polygonId,
        name: action.payload.polygonName
      });
      return Object.assign({}, state, { polygons });
    }
    case DELETE_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      polygons.splice(action.payload.polygonIndex, 1);
      return Object.assign({}, state, { polygons });
    }
    case START_REPORT:
      return Object.assign({}, state, { polygons: [], layerId: action.payload.layerId, layerTitle: action.payload.layerTitle });
    case DISCARD_REPORT:
      return Object.assign({}, state, { polygons: [], layerId: null });


    default:
      return state;
  }
}
