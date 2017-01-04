import {
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  SEND_REPORT,
  DISCARD_REPORT
} from 'actions';

const initialState = {
  polygons: []
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
    case DISCARD_REPORT:
      return Object.assign({}, state, { polygons: [] });

    default:
      return state;
  }
}
