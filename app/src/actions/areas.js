import { SAVE_AREA_OF_INTEREST, UPDATE_WORKING_AREA_OF_INTEREST } from 'actions';

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
