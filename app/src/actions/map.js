import PelagosClient from '../lib/pelagosClient';
import _ from "lodash";
import {
  VESSEL_INIT,
  SHOW_LOADING,
  SET_LAYERS,
  SET_ZOOM,
  SET_CENTER,
  TOGGLE_LAYER_VISIBILITY,
  SET_TIMELINE_DATES,
  GET_SERIESGROUP
} from "../constants";
const urlVessel = 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/sub/';

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

export function toggleLayerVisibility(layer) {
  return {
    type: TOGGLE_LAYER_VISIBILITY,
    payload: layer
  };
}

function groupData(vectorArray) {
  if (vectorArray && vectorArray.length > 1) {
    for (let index = 1, length = vectorArray.length; index < length; index++) {
      if (vectorArray[index] !== null) {
        if (index === 1) {
          vectorArray[0].category = Array.prototype.slice.call(vectorArray[0].category).concat(Array.prototype.slice.call(vectorArray[index].category));
          vectorArray[0].datetime = Array.prototype.slice.call(vectorArray[0].datetime).concat(Array.prototype.slice.call(vectorArray[index].datetime));
          vectorArray[0].latitude = Array.prototype.slice.call(vectorArray[0].latitude).concat(Array.prototype.slice.call(vectorArray[index].latitude));
          vectorArray[0].longitude = Array.prototype.slice.call(vectorArray[0].longitude).concat(Array.prototype.slice.call(vectorArray[index].longitude));
          vectorArray[0].series = Array.prototype.slice.call(vectorArray[0].series).concat(Array.prototype.slice.call(vectorArray[index].series));
          vectorArray[0].seriesgroup = Array.prototype.slice.call(vectorArray[0].seriesgroup).concat(Array.prototype.slice.call(vectorArray[index].seriesgroup));
          vectorArray[0].sigma = Array.prototype.slice.call(vectorArray[0].sigma).concat(Array.prototype.slice.call(vectorArray[index].sigma));
          vectorArray[0].weight = Array.prototype.slice.call(vectorArray[0].weight).concat(Array.prototype.slice.call(vectorArray[index].weight));
        } else {
          vectorArray[0].category = vectorArray[0].category.concat(Array.prototype.slice.call(vectorArray[index].category));
          vectorArray[0].datetime = vectorArray[0].datetime.concat(Array.prototype.slice.call(vectorArray[index].datetime));
          vectorArray[0].latitude = vectorArray[0].latitude.concat(Array.prototype.slice.call(vectorArray[index].latitude));
          vectorArray[0].longitude = vectorArray[0].longitude.concat(Array.prototype.slice.call(vectorArray[index].longitude));
          vectorArray[0].series = vectorArray[0].series.concat(Array.prototype.slice.call(vectorArray[index].series));
          vectorArray[0].seriesgroup = vectorArray[0].seriesgroup.concat(Array.prototype.slice.call(vectorArray[index].seriesgroup));
          vectorArray[0].sigma = vectorArray[0].sigma.concat(Array.prototype.slice.call(vectorArray[index].sigma));
          vectorArray[0].weight = vectorArray[0].weight.concat(Array.prototype.slice.call(vectorArray[index].weight));
        }
      }
    }
  }
  return vectorArray[0];
}

export function getSeriesGroup(seriesgroup, serie, filters) {
  return function (dispatch, getState) {
    const state = getState();

    const startYear = new Date(filters.startDate).getUTCFullYear();
    const endYear = new Date(filters.endDate).getUTCFullYear();
    let urls = [];
    for (let i = startYear; i <= endYear; i++) {
      urls.push(`${urlVessel}seriesgroup=${seriesgroup}/${i}-01-01T00:00:00.000Z,${i + 1}-01-01T00:00:00.000Z;0,0,0`);
    }
    let promises = [];
    for (let urlIndex = 0, length = urls.length; urlIndex < length; urlIndex++) {
      promises.push(new PelagosClient().obtainTile(urls[urlIndex], state.user.token));
    }

    Promise.all(promises).then(function (rawTileData) {
      if (rawTileData[0]) {
        let data = groupData(rawTileData);
        dispatch({
          type: GET_SERIESGROUP,
          payload: {
            seriesgroup: seriesgroup,
            seriesGroupData: data,
            series: _.uniq(data.series),
            selectedSeries: serie
          }
        });
      } else {
        dispatch({
          type: GET_SERIESGROUP,
          payload: null
        });
      }
    }.bind(this));
  }
}

export function setZoom(zoom) {
  return {
    type: SET_ZOOM,
    payload: zoom
  };
};

export function setCenter(center) {
  return {
    type: SET_CENTER,
    payload: center
  };
};

/*
 ** CartoDB layers:
 ** MPA
 ** EEZ
 ** High Seas Pockets
 ** RFMOs
 */
export function getWorkspace(workspace) {
  return function (dispatch, getState) {
    let state = getState();

    let path = '/workspace.json';
    if (state.user.token) {
      path = '/workspace-logged.json';
    }

    if (!!~[1, 2, 3].indexOf(+workspace)) {
      path = `/workspace-${workspace}.json`;
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

      return {
        layers,
        zoom: data.state.zoom,
        center: [data.state.lat, data.state.lon],
        timeline: [data.state.start_date, data.state.end_date]
      };
    }).then(({layers, zoom, center, timeline}) => {
      dispatch({
        type: SET_LAYERS,
        payload: layers
      });

      if (zoom) {
        dispatch({
          type: SET_ZOOM,
          payload: zoom
        });
      }

      if (center) {
        dispatch({
          type: SET_CENTER,
          payload: center
        });
      }

      if (timeline) {
        dispatch({
          type: SET_TIMELINE_DATES,
          payload: timeline
        });
      }

    }).catch(err => console.warn(`Unable to fetch the layers: ${err}`));
  }
};
