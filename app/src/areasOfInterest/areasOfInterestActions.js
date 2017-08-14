export const SAVE_AREA_OF_INTEREST = 'SAVE_AREA_OF_INTEREST'; // Save the current working AoI as a "permanent" AoI
export const UPDATE_WORKING_AREA_OF_INTEREST = 'UPDATE_WORKING_AREA_OF_INTEREST'; // Updates the current working AoI
export const DELETE_AREA_OF_INTEREST = 'DELETE_AREA_OF_INTEREST';
export const TOGGLE_AREA_OF_INTEREST_VISIBILITY = 'TOGGLE_AREA_OF_INTEREST_VISIBILITY';
export const SET_RECENTLY_CREATED_AREA_OF_INTEREST = 'SET_RECENTLY_CREATED_AREA_OF_INTEREST';

export function saveAreaOfInterest(areaOfInterest) {
  return (dispatch, getState) => {
    const area = areaOfInterest || Object.assign(getState().areas.editingArea);
    dispatch({
      type: SAVE_AREA_OF_INTEREST,
      payload: { area }
    });
  };
}

export function updateWorkingAreaOfInterest(area) {
  const { coordinates, name, color } = area;
  return (dispatch) => {
    dispatch({
      type: UPDATE_WORKING_AREA_OF_INTEREST,
      payload: { coordinates, name, color }
    });
  };
}

export function setRecentlyCreated(value) {
  return (dispatch) => {
    dispatch({
      type: SET_RECENTLY_CREATED_AREA_OF_INTEREST,
      payload: value
    });
  };
}

export function toggleAreaVisibility(areaIndex) {
  return {
    type: TOGGLE_AREA_OF_INTEREST_VISIBILITY,
    payload: { areaIndex }
  };
}

export function deleteArea(areaIndex) {
  return {
    type: DELETE_AREA_OF_INTEREST,
    payload: { areaIndex }
  };
}
