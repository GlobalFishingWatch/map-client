import {VESSEL_INIT, SHOW_LOADING, GET_LAYERS, UPDATE_LAYER} from "../constants";

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
  return function (dispatch) {
    let p1 = new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function (resolve, reject) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = returnLayers;
        httpRequest.open('GET', '/workspace.json', true);
        httpRequest.responseType = "text";
        httpRequest.send();

        function returnLayers() {
          if (httpRequest.readyState == XMLHttpRequest.DONE) {
            if (httpRequest.status == 200) {
              let data = JSON.parse(httpRequest.responseText);
              let layers = [];
              for (let prop in data.map.animations) {
                if (data.map.animations[prop].type === "CartoDBAnimation" && data.map.animations[prop].args.source.args.url.indexOf('http') === 0) {
                  layers.push(data.map.animations[prop].args);
                }
              }
              resolve(layers);
            }
          }
        }
      }
    );
    p1.then(
      function (layers) {
        dispatch({
          type: GET_LAYERS,
          payload: layers
        });
      });
  }
};
