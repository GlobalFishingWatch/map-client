import { GET_LAYER_LIBRARY } from 'actions';
import { getWorkspace } from 'actions/map';

export function getLayerLibrary() {
  return (dispatch, getState) => {
    const state = getState();

    // by now, API requires auth. This should change in future
    if (!state.user.token) return false;
    fetch(`${MAP_API_ENDPOINT}/v1/directory`, {
      headers: {
        Authorization: `Bearer ${state.user.token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const layers = data.entries;

      dispatch({
        type: GET_LAYER_LIBRARY,
        payload: layers
      });

      dispatch(getWorkspace());
    });

    return true;
  };
}
