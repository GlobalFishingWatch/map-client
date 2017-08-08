import { SAVE_AREA, SAVE_COORDS } from 'actions';

export function saveArea(name) {
  return (dispatch, getState) => {
    const area = Object.assign(getState().areas.editingArea, { name });
    dispatch({
      type: SAVE_AREA,
      payload: { area }
    });
  };
}

export function saveAreas(areas) {
  return (dispatch) => {
    areas.forEach((area) => {
      dispatch({
        type: SAVE_AREA,
        payload: { area }
      });
    });
  };
}

export function saveCoordinates(coordinates) {
  return (dispatch) => {
    dispatch({
      type: SAVE_COORDS,
      payload: coordinates
    });
  };
}
