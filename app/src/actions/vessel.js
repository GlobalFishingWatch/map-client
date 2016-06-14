import {VESSEL_INIT, VESSEL_ZOOM_UPDATE, VESSEL_TILE_LOADED, SHOW_LOADING, RESET_CACHE, ADD_LAYER} from '../constants';
import calculateBounds from '../lib/calculateBounds';
import PelagosClient from '../lib/pelagosClient';
var url = "https://storage.googleapis.com/skytruth-pelagos-production/pelagos/data/tiles/benthos-pipeline/gfw-vessel-scoring-602-tileset-2014-2016_2016-05-17/cluster_tiles/2015-01-01T00:00:00.000Z,2016-01-01T00:00:00.000Z;";


export function init(){
  return {
    type: VESSEL_INIT,
    payload:{
      visible: true,
      load: true
    }
  };
};

export function showLoading(show){
  return {
    type: SHOW_LOADING,
    payload:show
  };
};

export function addLayer(url){
  return {
    type: ADD_LAYER,
    payload:url
  };
};

export function resetCache(){
  return {
    type: RESET_CACHE
  };
};

export function loadZoom(map){
  return function(dispatch){
    dispatch({
      type: VESSEL_ZOOM_UPDATE
    });
    let bounds = calculateBounds(map);
    var obtainTile = function(key){
      new PelagosClient().obtainTile(url + key).then(function(data){
        let obj = {};
        obj[key] = data;
        dispatch({
          type: VESSEL_TILE_LOADED,
          payload:{
            data:obj
          }
        });
      });
    }

    for (var i = 0, length = bounds.length; i < length; i++) {
      obtainTile(bounds[i].toString());
    }

  }
}

export function move(map){
  return function(dispatch, getState){
    let state = getState();
    let bounds = calculateBounds(map);
    var obtainTile = function(key){
      new PelagosClient().obtainTile(url + key).then(function(data){
        let obj = {};
        obj[key] = data;
        dispatch({
          type: VESSEL_TILE_LOADED,
          payload:{
            data:obj
          }
        });
        dispatch({
          type: SHOW_LOADING,
          payload: false
        })
      });
    }

    for (var i = 0, length = bounds.length; i < length; i++) {
      if(!state.vessel.data || !state.vessel.data[bounds[i].toString()]){
        obtainTile(bounds[i].toString());
      }
    }

  }

}
