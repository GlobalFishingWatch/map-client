import _ from 'lodash';
import { LAYER_TYPES } from 'constants';
import {
  SET_LAYERS,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  SET_LAYER_OPACITY,
  SET_LAYER_HUE,
  SET_TILESET_URL,
  SET_MAX_ZOOM,
  SET_OVERALL_TIMELINE_DATES
} from 'actions';
import { updateFlagFilters } from 'actions/filters';

export function initLayers(workspaceLayers, libraryLayers) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.user.userPermissions.indexOf('seeVesselsLayers') === -1) {
      /* eslint no-param-reassign: 0 */
      workspaceLayers = workspaceLayers.filter(l => l.type !== LAYER_TYPES.ClusterAnimation);
      libraryLayers = libraryLayers.filter(l => l.type !== LAYER_TYPES.ClusterAnimation);
    }

    workspaceLayers.forEach(layer => {
      /* eslint no-param-reassign: 0 */
      layer.added = true;
      layer.library = false;
    });

    libraryLayers.forEach(libraryLayer => {
      const matchedWorkspaceLayer = _.find(workspaceLayers, workspaceLayer => libraryLayer.id === workspaceLayer.id);
      if (matchedWorkspaceLayer) {
        Object.assign(matchedWorkspaceLayer, {
          library: true, added: true, description: libraryLayer.description || matchedWorkspaceLayer.description
        });
      } else {
        workspaceLayers.push(Object.assign(libraryLayer, { added: false }));
      }
    });

    // parses opacity attribute
    workspaceLayers.forEach(layer => {
      const l = layer;
      if (!!layer.opacity) {
        l.opacity = parseFloat(layer.opacity);
      } else {
        l.opacity = 1;
      }
    });

    const vesselLayer = workspaceLayers
      .filter(l => l.type === LAYER_TYPES.ClusterAnimation)[0];

    if (vesselLayer !== undefined) {
      // TODO: we should probably store this somewhere else on the WS
      const tilesetUrl = vesselLayer.url;

      dispatch({
        type: SET_TILESET_URL, payload: tilesetUrl
      });
    }
    dispatch({
      type: SET_LAYERS, payload: workspaceLayers
    });
  };
}

export function loadTilesetMetadata(tilesetUrl) {
  return (dispatch, getState) => {
    const state = getState();

    const headers = {
      'Content-Type': 'application/json', Accept: 'application/json'
    };

    if (state.user.token) {
      headers.Authorization = `Bearer ${state.user.token}`;
    }

    fetch(`${tilesetUrl}/header`, {
      method: 'GET', headers
    })
      .then(res => res.json())
      .then(data => {
        if (data.maxZoom !== undefined) {
          dispatch({
            type: SET_MAX_ZOOM, payload: data.maxZoom
          });
        }

        if (!!data.colsByName && !!data.colsByName.datetime && !!data.colsByName.datetime.max && !!data.colsByName.datetime.min) {
          dispatch({
            type: SET_OVERALL_TIMELINE_DATES,
            payload: [new Date(data.colsByName.datetime.min), new Date(data.colsByName.datetime.max)]
          });
        }
      });

    dispatch({
      type: SET_TILESET_URL, payload: tilesetUrl
    });
  };
}

export function toggleLayerVisibility(layerId, forceStatus = null) {
  return {
    type: TOGGLE_LAYER_VISIBILITY, payload: {
      layerId, forceStatus
    }
  };
}

export function toggleLayerWorkspacePresence(layerId, forceStatus = null) {
  return {
    type: TOGGLE_LAYER_WORKSPACE_PRESENCE, payload: {
      layerId, forceStatus
    }
  };
}

export function setLayerOpacity(opacity, layerId) {
  return {
    type: SET_LAYER_OPACITY, payload: {
      layerId, opacity
    }
  };
}

export function setLayerHue(hue, layerId) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYER_HUE, payload: {
        layerId, hue
      }
    });
    // TODO we might want to override all filters hue settings here (see with Dani)
    dispatch(updateFlagFilters());
  };
}
