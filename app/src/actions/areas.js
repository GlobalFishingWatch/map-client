import { SAVE_AREA, SAVE_EDITING_AREA } from 'actions';

export function saveArea(name, color) {
  return (dispatch, getState) => {
    const area = Object.assign(getState().areas.editingArea, { name, color });
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

export function saveEditingArea(area) {
  const { coordinates, name, color } = area;
  return (dispatch) => {
    dispatch({
      type: SAVE_EDITING_AREA,
      payload: { coordinates, name, color }
    });
  };
}
