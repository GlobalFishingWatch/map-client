import { applyFleetOverrides } from 'vesselInfo/vesselInfoActions';

export const SET_FLEETS = 'SET_FLEETS';
export const TOGGLE_FLEET_VISIBILITY = 'TOGGLE_FLEET_VISIBILITY';

export const setFleetsFromWorkspace = fleets => ({
  type: SET_FLEETS,
  payload: fleets
});

export const toggleFleetVisibility = id => (dispatch) => {
  dispatch({
    type: TOGGLE_FLEET_VISIBILITY,
    payload: id
  });
  dispatch(applyFleetOverrides());
};
