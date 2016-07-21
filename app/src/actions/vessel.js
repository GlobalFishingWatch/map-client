import {VESSEL_INIT, SHOW_LOADING, SET_LAYERS, UPDATE_LAYER} from "../constants";

const url = "https://storage.googleapis.com/skytruth-pelagos-production/pelagos/data/tiles/benthos-pipeline/gfw-vessel-scoring-602-tileset-2014-2016_2016-05-17/cluster_tiles/2015-01-01T00:00:00.000Z,2016-01-01T00:00:00.000Z;";


export function init() {
  return {
    type: VESSEL_INIT,
    payload: {
      visible: true,
      load: true
    }
  };
};

export function showLoading(show) {
  return {
    type: SHOW_LOADING,
    payload: show
  };
};

export function updateLayer(layer) {
  return {
    type: UPDATE_LAYER,
    payload: layer
  };
}

/*
 ** CartoDB layers:
 ** MPA
 ** EEZ
 ** High Seas Pockets
 ** RFMOs
 */
export function getLayers() {
  return function (dispatch, getState) {
    let state = getState();

    let path = '/workspace.json';
    if(state.user.token){
      path = '/workspace-logged.json';
    }
    fetch(path, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + state.user.token
      }
    }).then((response) => {
      if(response.ok){
        return response.json();
      }
    }).then((data) => {
      let layers = [];
      for (let prop in data.map.animations) {
        if (data.map.animations[prop].type === "CartoDBAnimation" && data.map.animations[prop].args.source.args.url.indexOf('http') === 0) {
          layers.push(data.map.animations[prop].args);
        }
      }
      return layers;
    }).then((layers) => {
      dispatch({
        type: SET_LAYERS,
        payload: layers
      });
    });
  }
};
