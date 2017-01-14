import _ from 'lodash';
import { GET_LAYER_LIBRARY, SET_LAYERS } from 'actions';
import { getWorkspace } from 'actions/workspace';
import calculateLayerId from 'util/calculateLayerId';

export function getLayerLibrary() {
  return (dispatch, getState) => {
    const state = getState();

    const options = {};
    if (!state.user.token) {
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
    const addedLayer = _.find(newLayers, layer => layer.id === layerToAdd.id);

    if (layerToAdd === undefined) {
      return;
    }

    layerToAdd.added = true;
    layerToAdd.visible = true;

    // not added, updates attributes and adds it into the array of layers
    if (addedLayer === undefined) {
      newLayers.push(layerToAdd);
    } else {
      // already added, only need to update its attributes
      addedLayer.added = true;
      addedLayer.visible = true;
    }

    dispatch({
      type: GET_LAYER_LIBRARY, payload: layerLibrary
    });

    dispatch({
      type: SET_LAYERS, payload: newLayers
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
    if (layerToRemove === undefined) {
      return;
    }

    layerLibrary.added = false;
    layerToRemove.added = false;

    dispatch({
      type: GET_LAYER_LIBRARY, payload: library
    });

    dispatch({
      type: SET_LAYERS, payload: newLayers
    });
  };
}
