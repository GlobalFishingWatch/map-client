import {
  SET_FLEETS,
  TOGGLE_FLEET_VISIBILITY
} from 'fleets/fleetsActions';

let currentFleetId = 0;

const initialState = {
  fleets: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FLEETS : {
      action.payload.forEach((fleet) => {
        fleet.id = currentFleetId++;
      });
      return { ...state, fleets: action.payload };
    }
    case TOGGLE_FLEET_VISIBILITY : {
      const fleetIndex = state.fleets.findIndex(f => f.id === action.payload);
      const fleet = { ...state.fleets[fleetIndex] };
      fleet.visible = !fleet.visible;
      const fleets = [...state.fleets.slice(0, fleetIndex), fleet, ...state.fleets.slice(fleetIndex + 1)];
      return { ...state, fleets };
    }
    default:
      return state;
  }
}
