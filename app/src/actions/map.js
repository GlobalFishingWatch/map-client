import {VESSEL_INIT, SHOW_LOADING, SET_LAYERS, TOGGLE_LAYER_VISIBILITY, GET_SERIESGROUP} from "../constants";
import PelagosClient from '../lib/PelagosClient';
import _ from 'lodash';
const urlVessel = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/sub/';

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

export function toggleLayerVisibility(layer) {
  return {
    type: TOGGLE_LAYER_VISIBILITY,
    payload: layer
  };
}

export function getSeriesGroup(seriesgroup, serie){
  return function (dispatch , getState) {
    const state = getState();
    let url = `${urlVessel}seriesgroup=${seriesgroup}/2015-01-01T00:00:00.000Z,2016-01-01T00:00:00.000Z;0,0,0`

    new PelagosClient().obtainTile(url, state.user.token).then((data) => {
      dispatch({
        type: GET_SERIESGROUP,
        payload: {
          seriesGroup: data,
          series: _.uniq(data.series),
          selectedSeries: serie
        }
      });
    });
  }
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
    if (state.user.token) {
      path = '/workspace-logged.json';
    }
    fetch(path, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + state.user.token
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then((data) => {
      let layers = [];
      let allowedTypes = ['CartoDBAnimation', 'ClusterAnimation']
      for (let prop in data.map.animations) {
        if (allowedTypes.indexOf(data.map.animations[prop].type) !== -1 && data.map.animations[prop].args.source.args.url.indexOf('http') === 0) {
          let layerDetails = data.map.animations[prop].args;
          layerDetails.type = data.map.animations[prop].type;
          layers.push(layerDetails);
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
