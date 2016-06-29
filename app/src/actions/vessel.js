import {VESSEL_INIT, VESSEL_ZOOM_UPDATE, VESSEL_TILE_LOADED, SHOW_LOADING, RESET_CACHE, ADD_LAYER} from '../constants';
import calculateBounds from '../lib/calculateBounds';
import PelagosClient from '../lib/pelagosClient';
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

/*
** CartoDB layers:
** MPA
** EEZ
** High Seas Pockets
** RFMOs
*/
export function addLayer() {
  return {
        type: ADD_LAYER,
        payload: ["http://cartodb.skytruth.org/user/dev/api/v2/viz/d7c9313c-97b8-11e5-87b3-0242ac110002/viz.json", "http://cartodb.skytruth.org/user/dev/api/v2/viz/2cf0043c-97ba-11e5-87b3-0242ac110002/viz.json", "http://cartodb.skytruth.org/user/dev/api/v2/viz/90467e80-97ba-11e5-87b3-0242ac110002/viz.json", "http://cartodb.skytruth.org/user/dev/api/v2/viz/3e755a02-97cb-11e5-87b3-0242ac110002/viz.json"]
      }
  let p1 = new Promise(
    // The resolver function is called with the ability to resolve or
    // reject the promise
    function(resolve, reject) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = returnLayers;
        httpRequest.open('GET', '/workspace.json', true);
        httpRequest.responseType = "text";
        httpRequest.send();
        
        function returnLayers() {
          if (httpRequest.readyState == XMLHttpRequest.DONE ) {
             if (httpRequest.status == 200) {
                let data = JSON.parse(httpRequest.responseText);
                let layers = [];
                for (let prop in data.map.animations) {
                  if(data.map.animations[prop].type === "CartoDBAnimation" && data.map.animations[prop].args.source.args.url.indexOf('http') === 0) {
                    layers.push(data.map.animations[prop].args.source.args.url);
                  }
                }
                resolve(layers);
              }
           }
        }
      }
  );
  p1.then( 
    function(layers) {
      return {
        type: ADD_LAYER,
        payload: ["http://cartodb.skytruth.org/user/dev/api/v2/viz/d7c9313c-97b8-11e5-87b3-0242ac110002/viz.json", "http://cartodb.skytruth.org/user/dev/api/v2/viz/2cf0043c-97ba-11e5-87b3-0242ac110002/viz.json", "http://cartodb.skytruth.org/user/dev/api/v2/viz/90467e80-97ba-11e5-87b3-0242ac110002/viz.json", "http://cartodb.skytruth.org/user/dev/api/v2/viz/3e755a02-97cb-11e5-87b3-0242ac110002/viz.json"]
      }
    });
};

export function resetCache() {
  return {
    type: RESET_CACHE
  };
};

export function loadZoom(map) {
  return function (dispatch) {
    dispatch({
      type: VESSEL_ZOOM_UPDATE
    });
    const bounds = calculateBounds(map);
    const obtainTile = function (key) {
      new PelagosClient().obtainTile(url + key).then(function (data) {
        let obj = {};
        obj[key] = data;
        dispatch({
          type: VESSEL_TILE_LOADED,
          payload: {
            data: obj
          }
        });
      });
    }
    for (let i = 0, length = bounds.length; i < length; i++) {
      obtainTile(bounds[i].toString());
    }

  }
}

export function move(map) {
  return function (dispatch, getState) {
    const state = getState();
    const bounds = calculateBounds(map);
    const vData = state.vessel.data;
    const obtainTile = function (key) {
      new PelagosClient().obtainTile(url + key).then(function (data) {
        let obj = {};
        obj[key] = data;
        dispatch({
          type: VESSEL_TILE_LOADED,
          payload: {
            data: obj
          }
        });
        dispatch({
          type: SHOW_LOADING,
          payload: false
        })
      });
    }

    for (let i = 0, length = bounds.length; i < length; i++) {
      if (!vData || !vData[bounds[i].toString()]) {
        obtainTile(bounds[i].toString());
      }
    }

  }

}
