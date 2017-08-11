import { SAVE_AREA_OF_INTEREST, UPDATE_WORKING_AREA_OF_INTEREST } from 'actions';
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
    case SAVE_AREA_OF_INTEREST:
      if (action.payload.area) {
        const areas = state.data.length > 0 ? state.data : [];
        return Object.assign({}, state, { data: areas.concat([action.payload.area]) });
      }
      return state;
    case UPDATE_WORKING_AREA_OF_INTEREST:
      return Object.assign({}, state, {
        editingArea: {
          name: action.payload.name === null ? '' : action.payload.name || state.editingArea.name,
          color: action.payload.color || state.editingArea.color,
          coordinates: action.payload.coordinates || state.editingArea.coordinates
        }
      });
    default:
      return state;
  }
}
