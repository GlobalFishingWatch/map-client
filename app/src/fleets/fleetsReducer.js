import {
  SET_FLEETS
} from 'fleets/fleetsActions';

const initialState = {
  fleets: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FLEETS : {
      return { ...state, fleets: action.payload };
    }
    default:
      return state;
  }
}
