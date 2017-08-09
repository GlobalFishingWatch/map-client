import { SAVE_AREA, SAVE_EDITING_AREA } from 'actions';
import { COLORS } from 'constants';

const initialState = {
  data: [],
  editingArea: {
    name: '',
    color: Object.keys(COLORS)[0],
    coordinates: []
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_AREA:
      if (action.payload.area) {
        const areas = state.data.length > 0 ? state.data : [];
        return Object.assign({}, state, { data: areas.concat([action.payload.area]) });
      }
      return state;
    case SAVE_EDITING_AREA:
      if (action.payload) {
        // Use null to reset field
        const name = action.payload.name === null ? '' : action.payload.name || state.editingArea.name;
        return Object.assign({}, state, {
          editingArea: {
            name,
            color: action.payload.color || state.editingArea.color,
            coordinates: action.payload.coordinates || state.editingArea.coordinates
          }
        });
      }
      return state;
    default:
      return state;
  }
}
