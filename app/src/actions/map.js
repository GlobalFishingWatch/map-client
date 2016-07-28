import {VESSEL_INIT, SHOW_LOADING, SET_LAYERS, SET_ZOOM, SET_CENTER, TOGGLE_LAYER_VISIBILITY, SET_TIMELINE_DATES} from "../constants";

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

    if(!!~[1, 2, 3].indexOf(+workspace)) {
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
        center: [ data.state.lat, data.state.lon ],
        timeline: [ data.state.start_date, data.state.end_date]
      };
    }).then(({ layers, zoom, center, timeline }) => {
      dispatch({
        type: SET_LAYERS,
        payload: layers
      });

      if(zoom) {
        dispatch({
          type: SET_ZOOM,
          payload: zoom
        });
      }

      if(center) {
        dispatch({
          type: SET_CENTER,
          payload: center
        });
      }

      if(timeline) {
        dispatch({
          type: SET_TIMELINE_DATES,
          payload: timeline
        });
      }

    }).catch(err => console.warn(`Unable to fetch the layers: ${err}`));
  }
};
