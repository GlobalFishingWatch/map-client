import { CREATE_AREA, SAVE_COORDS } from 'actions';

export function createArea(coordinates) {
  return (dispatch) => {
    dispatch({
      type: CREATE_AREA,
      payload: { area: coordinates }
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

export { createArea as default };
