import _ from 'lodash';
import {
  GET_LAYER_LIBRARY,
  SET_LAYERS
} from 'actions';

import {
  getWorkspace
} from 'actions/workspace';

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

      // adds an id to each layer. Remove when API gives id
      let id = 0;
      layers.forEach(layer => {
        /* eslint no-param-reassign: 0 */
        layer.id = id;
        layer.added = false;
        id++;
      });

      dispatch({
        type: GET_LAYER_LIBRARY,
        payload: layers
      });

      dispatch(getWorkspace());
    });

    return true;
  };
}

export function addLayer(layerId) {
  return (dispatch, getState) => {
    const state = getState();
    const layerLibrary = _.cloneDeep(state.layerLibrary.layers);
    const layerToAdd = _.find(layerLibrary, (layer) => layer.id === layerId);
    const newLayers = _.cloneDeep(state.layers);

    if (layerToAdd === undefined) return;

    // already added
    if (newLayers.indexOf(layerToAdd) !== -1) return;

    layerToAdd.added = true;
    layerToAdd.visible = true;

    newLayers.push(layerToAdd);

    dispatch({
      type: GET_LAYER_LIBRARY,
      payload: layerLibrary
    });

    dispatch({
      type: SET_LAYERS,
      payload: newLayers
    });
  };
}

export function removeLayer(layerId) {
  return (dispatch, getState) => {
    const state = getState();
    const library = _.cloneDeep(state.layerLibrary.layers);
    const newLayers = _.cloneDeep(state.layers);

    const layerLibrary = _.find(library, (layer) => layer.id === layerId);
    const layerToRemove = _.find(newLayers, (layer) => layer.id === layerId);
    if (layerToRemove === undefined) return;

    layerLibrary.added = false;
    layerToRemove.added = false;

    dispatch({
      type: GET_LAYER_LIBRARY,
      payload: library
    });

    dispatch({
      type: SET_LAYERS,
      payload: newLayers
    });
  };
}
