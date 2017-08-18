import {
  SAVE_AREA_OF_INTEREST,
  UPDATE_AREA_OF_INTEREST,
  UPDATE_WORKING_AREA_OF_INTEREST,
  TOGGLE_AREA_OF_INTEREST_VISIBILITY,
  SET_RECENTLY_CREATED_AREA_OF_INTEREST,
  SET_EDIT_AREA_INDEX,
  DELETE_AREA_OF_INTEREST
} from 'areasOfInterest/areasOfInterestActions';
import { COLORS } from 'config';

const initialState = {
  data: [],
  editingArea: {
    name: '',
    color: Object.keys(COLORS)[0],
    coordinates: [],
    visible: true
  },
  editAreaIndex: null,
  recentlyCreated: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_AREA_OF_INTEREST:
      if (action.payload.area) {
        const areas = state.data.length > 0 ? state.data : [];
        return Object.assign({}, state, { data: areas.concat([action.payload.area]) });
      }
      return state;
    case UPDATE_AREA_OF_INTEREST:
      if (action.payload.area) {
        const areas = state.data.map((area, i) => (
          i === action.payload.editIndex ? action.payload.area : area
        ));
        return Object.assign({}, state, { data: areas });
      }
      return state;
    case UPDATE_WORKING_AREA_OF_INTEREST:
      return Object.assign({}, state, {
        editingArea: {
          name: action.payload.name === '' ? '' : action.payload.name || state.editingArea.name,
          color: action.payload.color || state.editingArea.color,
          coordinates: action.payload.coordinates || state.editingArea.coordinates,
          visible: state.editingArea.visible
        }
      });
    case DELETE_AREA_OF_INTEREST: {
      const updatedAreas = state.data.filter((area, i) => i !== action.payload.areaIndex);
      return Object.assign({}, state, { data: updatedAreas });
    }
    case TOGGLE_AREA_OF_INTEREST_VISIBILITY: {
      const updatedAreas = state.data.map((area, i) => {
        if (i === action.payload.areaIndex) {
          area.visible = !area.visible;
        }
        return area;
      });
      return Object.assign({}, state, { data: updatedAreas });
    }
    case SET_RECENTLY_CREATED_AREA_OF_INTEREST:
      return Object.assign({}, state, { recentlyCreated: action.payload });
    case SET_EDIT_AREA_INDEX:
      return Object.assign({}, state, { editAreaIndex: action.payload });
    default:
      return state;
  }
}
