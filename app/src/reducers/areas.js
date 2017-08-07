import { CREATE_AREA } from 'actions';

const initialState = {
  data: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_AREA:
      if (action.payload.area) {
        const areas = state.data.lenght > 0 ? state.data : [];
        return Object.assign({}, state, { data: areas.concat([action.payload.area]) });
      }
      return state;
    default:
      return state;
  }
}
