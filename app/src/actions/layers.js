import _ from 'lodash';
import { LAYER_TYPES } from 'constants';
import {
  SET_LAYERS,
  SET_LAYER_HEADER,
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
import { refreshFlagFiltersLayers } from 'actions/filters';
import { addHeatmapLayerFromLibrary, removeHeatmapLayerFromLibrary } from 'actions/heatmap';


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
    .then((res) => {
      if (res.status >= 400) {
        console.warn(`loading of layer failed ${tilesetUrl}`);
        Promise.reject();
        return null;
      }
      return res.json();
    })
    .then((data) => {
      resolve(data);
    }).catch((err) => {
      console.warn(err);
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

function setLayerHeader(layerId, header) {
  return (dispatch) => {
    dispatch({
      type: SET_LAYER_HEADER,
      payload: {
        layerId,
        header
      }
    });
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
          description: libraryLayer.description || matchedWorkspaceLayer.description,
          reportId: libraryLayer.reportId
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
        headerPromise.then((header) => {
          if (header !== null) {
            heatmapLayer.header = header;
            dispatch(setGlobalFiltersFromHeader(header));
          }
        });
        headersPromises.push(headerPromise);
      });

    const headersPromise = Promise.all(headersPromises.map(p => p.catch(e => e)));
    headersPromise
    .then(() => {
      dispatch({
        type: SET_LAYERS,
        payload: workspaceLayers.filter(layer => layer.type !== LAYER_TYPES.Heatmap || layer.header !== undefined)
      });
      dispatch(refreshFlagFiltersLayers());
    }).catch((err) => {
      console.warn(err);
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
  return (dispatch, getState) => {
    const newLayer = getState().layers.workspaceLayers.find(layer => layer.id === layerId);
    const added = (forceStatus !== null) ? forceStatus : !newLayer.added;
    dispatch({
      type: TOGGLE_LAYER_WORKSPACE_PRESENCE,
      payload: {
        layerId,
        added
      }
    });
    if (newLayer.type === LAYER_TYPES.Heatmap) {
      if (added === true) {
        const url = newLayer.url;

        if (newLayer.header === undefined) {
          loadLayerHeader(url, getState().user.token).then((header) => {
            if (header) {
              dispatch(setLayerHeader(layerId, header));
              dispatch(addHeatmapLayerFromLibrary(layerId, url));
              dispatch(setGlobalFiltersFromHeader(header));
              dispatch(refreshFlagFiltersLayers());
            }
          });
        } else {
          dispatch(addHeatmapLayerFromLibrary(layerId, url));
          dispatch(refreshFlagFiltersLayers());
        }
      } else {
        dispatch(removeHeatmapLayerFromLibrary(layerId));
        dispatch(refreshFlagFiltersLayers());
      }
    }
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
    dispatch(refreshFlagFiltersLayers());
  };
}

export function addCustomLayer(id, url, name, description) {
  return {
    type: ADD_CUSTOM_LAYER,
    payload: {
      id,
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
