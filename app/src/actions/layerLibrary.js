import { GET_LAYER_LIBRARY } from 'actions';
import { getWorkspace } from 'actions/workspace';
import calculateLayerId from 'util/calculateLayerId';
import { toggleLayerVisibility, toggleLayerWorkspacePresence } from 'actions/layers';

export function getLayerLibrary(workspaceID) {
  return (dispatch, getState) => {
    const state = getState();

    const options = {};
    if (state.user.token) {
      options.headers = {
        Authorization: `Bearer ${state.user.token}`
      };
    }

    fetch(`${MAP_API_ENDPOINT}/v1/directory`, options)
      .then(res => res.json())
      .then(data => {
        const layers = data.entries.map(l => ({
          id: l.args.id,
          title: l.args.title,
          description: l.args.description,
          color: l.args.color,
          visible: false,
          type: l.type,
          url: l.args.source.args.url,
          added: false,
          library: true
        }));

        layers.forEach(layer => {
          /* eslint no-param-reassign: 0 */
          layer.id = calculateLayerId(layer);
        });

        dispatch({
          type: GET_LAYER_LIBRARY, payload: layers
        });

        dispatch(getWorkspace(workspaceID));
      });

    return true;
  };
}

export function addLayer(layerId) {
  return (dispatch) => {
    dispatch(toggleLayerVisibility(layerId, true));
    dispatch(toggleLayerWorkspacePresence(layerId, true));
  };
}

export function removeLayer(layerId) {
  return (dispatch) => {
    dispatch(toggleLayerVisibility(layerId, false));
    dispatch(toggleLayerWorkspacePresence(layerId, false));
  };
}
