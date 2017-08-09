import { SAVE_AREA, SAVE_EDITING_AREA } from 'actions';

const initialState = {
  data: [],
  editingArea: {
    name: '',
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
        return Object.assign({}, state, {
          editingArea: {
            name: action.payload.name || state.editingArea.name,
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
