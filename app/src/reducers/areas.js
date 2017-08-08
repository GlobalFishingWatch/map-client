import { SAVE_AREA, SAVE_COORDS } from 'actions';

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
        const areas = state.data.lenght > 0 ? state.data : [];
        return Object.assign({}, state, { data: areas.concat([action.payload.area]) });
      }
      return state;
    case SAVE_COORDS:
      if (action.payload.coordinates) {
        return Object.assign({}, state, {
          editingArea: {
            name: state.editingArea.name,
            coordinates: action.payload.coordinates
          }
        });
      }
      return state;
    default:
      return state;
  }
}
