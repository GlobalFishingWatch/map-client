import { SAVE_AREA_OF_INTEREST, UPDATE_WORKING_AREA_OF_INTEREST, TOGGLE_AREA_VISIBILITY, SET_RECENTLY_CREATED, DELETE_AREA } from 'actions';

export function saveAreaOfInterest() {
  return (dispatch, getState) => {
    const area = Object.assign(getState().areas.editingArea);
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
      type: SET_RECENTLY_CREATED,
      payload: value
    });
  };
}

export function toggleAreaVisibility(areaIndex) {
  return {
    type: TOGGLE_AREA_VISIBILITY,
    payload: { areaIndex }
  };
}

export function deleteArea(areaIndex) {
  return {
    type: DELETE_AREA,
    payload: { areaIndex }
  };
}
