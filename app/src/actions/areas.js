import { CREATE_AREA } from 'actions';

export function createArea(coordinates) {
  return (dispatch) => {
    dispatch({
      type: CREATE_AREA,
      payload: { area: coordinates }
    });
  };
}

export { createArea as default };
