import _ from 'lodash';
import { LAYER_TYPES } from 'constants';
import {
  SET_LAYERS,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  SET_LAYER_OPACITY,
  SET_LAYER_HUE,
  SET_MAX_ZOOM,
  SET_OVERALL_TIMELINE_DATES,
  ADD_CUSTOM_LAYER,
  TOGGLE_LAYER_PANEL_EDIT_MODE,
  SET_WORKSPACE_LAYER_LABEL,
  SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE
} from 'actions';
import { updateFlagFilters, setFlagFiltersLayers } from 'actions/filters';
import { toggleHeatmapLayer } from 'actions/heatmap';


function loadLayerHeader(tilesetUrl, token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve) => {
    fetch(`${tilesetUrl}/header`, {
      method: 'GET',
      headers
    })
    .then(res => res.json())
    .then((data) => {
      resolve(data);
    });
  });
}

function setGlobalFiltersFromHeader(data) {
  return (dispatch) => {
    if (data.maxZoom !== undefined) {
      dispatch({
        type: SET_MAX_ZOOM,
        payload: data.maxZoom
      });
    }

    if (!!data.colsByName && !!data.colsByName.datetime && !!data.colsByName.datetime.max && !!data.colsByName.datetime.min) {
      dispatch({
        type: SET_OVERALL_TIMELINE_DATES,
        payload: [new Date(data.colsByName.datetime.min), new Date(data.colsByName.datetime.max)]
      });
    }
  };
}


export function initLayers(workspaceLayers, libraryLayers) {
  return (dispatch, getState) => {
    const state = getState();

    if (state.user.userPermissions.indexOf('seeVesselsLayers') === -1) {
      workspaceLayers = workspaceLayers.filter(l => l.type !== LAYER_TYPES.Heatmap);
      libraryLayers = libraryLayers.filter(l => l.type !== LAYER_TYPES.Heatmap);
    }

    workspaceLayers.forEach((layer) => {
      layer.label = layer.label || layer.title;
      layer.added = true;
      layer.library = false;
    });

    libraryLayers.forEach((libraryLayer) => {
      const matchedWorkspaceLayer = _.find(workspaceLayers, workspaceLayer => libraryLayer.id === workspaceLayer.id);
      if (matchedWorkspaceLayer) {
        Object.assign(matchedWorkspaceLayer, {
          library: true,
          added: true,
          description: libraryLayer.description || matchedWorkspaceLayer.description
        });
      } else {
        workspaceLayers.push(Object.assign(libraryLayer, { added: false }));
      }
    });

    // parses opacity attribute
    workspaceLayers.forEach((layer) => {
      const l = layer;
      if (!!layer.opacity) {
        l.opacity = parseFloat(layer.opacity);
      } else {
        l.opacity = 1;
      }
    });

    const headersPromises = [];
    workspaceLayers
      .filter(l => l.type === LAYER_TYPES.Heatmap && l.added === true)
      .forEach((heatmapLayer) => {
        const headerPromise = loadLayerHeader(heatmapLayer.url, getState().user.token);
        headerPromise.then((headerData) => {
          heatmapLayer.header = headerData;
          dispatch(setGlobalFiltersFromHeader(headerData));
        });
        headersPromises.push(headerPromise);
      });

    const headersPromise = Promise.all(headersPromises);
    headersPromise.then(() => {
      dispatch({
        type: SET_LAYERS,
        payload: workspaceLayers
      });
      dispatch(setFlagFiltersLayers());
    });
  };
}

export function toggleLayerVisibility(layerId, forceStatus = null) {
  return {
    type: TOGGLE_LAYER_VISIBILITY,
    payload: {
      layerId,
      forceStatus
    }
  };
}

export function toggleLayerWorkspacePresence(layerId, forceStatus = null) {
  // TODO move final shown/hide status here (now both on reducer and heatmap action)
  // if shown:
  // check if header data is already loaded in layerId
  // if not, load header, then proceed with heatmap loading
  return (dispatch) => {
    dispatch({
      type: TOGGLE_LAYER_WORKSPACE_PRESENCE,
      payload: {
        layerId,
        forceStatus
      }
    });
    // TODO check if layer is heatmap here
    dispatch(toggleHeatmapLayer(layerId, forceStatus));
  };
}

export function setLayerOpacity(opacity, layerId) {
  return {
    type: SET_LAYER_OPACITY,
    payload: {
      layerId,
      opacity
    }
  };
}

export function setLayerHue(hue, layerId) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYER_HUE,
      payload: {
        layerId,
        hue
      }
    });
    // TODO we might want to override all filters hue settings here (see with Dani)
    dispatch(updateFlagFilters());
  };
}

export function addCustomLayer(url, name, description) {
  return {
    type: ADD_CUSTOM_LAYER,
    payload: {
      url,
      name,
      description
    }
  };
}

export function toggleLayerPanelEditMode(forceMode = null) {
  return {
    type: TOGGLE_LAYER_PANEL_EDIT_MODE,
    payload: {
      forceMode
    }
  };
}

export function setLayerLabel(layerId, label) {
  return {
    type: SET_WORKSPACE_LAYER_LABEL,
    payload: {
      layerId, label
    }
  };
}

export function confirmLayerRemoval(layerId) {
  return {
    type: SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE,
    payload: layerId
  };
}
