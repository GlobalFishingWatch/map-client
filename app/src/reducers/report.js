import {
  TOGGLE_REPORT_POLYGON,
  SEND_REPORT,
  DISCARD_REPORT
} from 'actions';

const initialState = {
  polygons: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_REPORT_POLYGON: {
      const polygons = state.polygons.slice();
      const polygonIndex = polygons.findIndex(polygon => polygon.id === action.payload.polygonId);
      if (polygonIndex === -1) {
        polygons.push({
          id: action.payload.polygonId,
          name: action.payload.polygonName
        });
      } else {
        polygons.splice(polygonIndex, 1);
      }
      return Object.assign({}, state, { polygons });
    }

    default:
      return state;
  }
}
