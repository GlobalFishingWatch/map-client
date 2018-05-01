import find from 'lodash/find';
import { LAYER_TYPES, LAYER_TYPES_WITH_HEADER, HEADERLESS_LAYERS, TEMPORAL_EXTENTLESS, LAYER_TYPES_MAPBOX_GL } from 'constants';
import { SET_OVERALL_TIMELINE_DATES } from 'filters/filtersActions';
import { refreshFlagFiltersLayers } from 'filters/filterGroupsActions';
import { setMaxZoom } from 'map/mapViewportActions';
import { updateMapStyle } from 'map/mapStyleActions';
import {
  initHeatmapLayers,
  addHeatmapLayerFromLibrary,
  removeHeatmapLayerFromLibrary,
  loadAllTilesForLayer
} from 'activityLayers/heatmapActions';
import calculateLayerId from 'utils/calculateLayerId';
import { hueToRgbHexString } from 'utils/colors';
import { loadCustomLayer } from './customLayerActions';

export const SET_LAYERS = 'SET_LAYERS';
export const SET_LAYER_HEADER = 'SET_LAYER_HEADER';
export const TOGGLE_LAYER_VISIBILITY = 'TOGGLE_LAYER_VISIBILITY';
export const TOGGLE_LAYER_WORKSPACE_PRESENCE = 'TOGGLE_LAYER_WORKSPACE_PRESENCE';
export const SET_LAYER_TINT = 'SET_LAYER_TINT';
export const SET_LAYER_OPACITY = 'SET_LAYER_OPACITY';
export const TOGGLE_LAYER_SHOW_LABELS = 'TOGGLE_LAYER_SHOW_LABELS';
export const ADD_CUSTOM_LAYER = 'ADD_CUSTOM_LAYER';
export const TOGGLE_LAYER_PANEL_EDIT_MODE = 'TOGGLE_LAYER_PANEL_EDIT_MODE';
export const SET_WORKSPACE_LAYER_LABEL = 'SET_WORKSPACE_LAYER_LABEL';
export const SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE = 'SHOW_CONFIRM_LAYER_REMOVAL_MESSAGE';


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


// TODO This shouldn't be here
function setGlobalFiltersFromHeader(data) {
  return (dispatch) => {
    if (data.maxZoom !== undefined) {
      dispatch(setMaxZoom(data.maxZoom));
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
    if (state.user.userPermissions !== null && state.user.userPermissions.indexOf('seeVesselsLayers') === -1) {
      workspaceLayers = workspaceLayers.filter(l => l.type !== LAYER_TYPES.Heatmap);
      libraryLayers = libraryLayers.filter(l => l.type !== LAYER_TYPES.Heatmap);
    }

    workspaceLayers.forEach((layer) => {
      // while encounters layers have a different type than heatmap in workspaces,
      // they are treated the same way by the front-end, except on map interaction (see heatmap actions)
      if (layer.type === LAYER_TYPES.Encounters) {
        layer.type = LAYER_TYPES.Heatmap;
        layer.subtype = LAYER_TYPES.Encounters;
      } else if (layer.type === LAYER_TYPES.Heatmap) {
        layer.subtype = LAYER_TYPES.Heatmap;
      }

      if (layer.type === LAYER_TYPES.Heatmap && layer.tilesetId === undefined) {
        layer.tilesetId = calculateLayerId({ url: layer.url });
        console.warn(`Heatmap layers should specify their tilesetId. Guessing ${layer.tilesetId} from URL ${layer.url}`);
      }
      layer.label = layer.label || layer.title;
      layer.added = true;
      layer.library = false;
    });

    libraryLayers.forEach((libraryLayer) => {
      const matchedWorkspaceLayer = find(workspaceLayers, workspaceLayer => libraryLayer.id === workspaceLayer.id);
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

    workspaceLayers.forEach((layer) => {
      // parses opacity attribute
      if (!!layer.opacity) {
        layer.opacity = parseFloat(layer.opacity);
      } else {
        layer.opacity = 1;
      }
      // Mapbox branch compatibility: heatmap layers should have: hue, static layers: color
      if (layer.type === LAYER_TYPES.Static) {
        if (layer.color === undefined) {
          layer.color = hueToRgbHexString(layer.hue, true);
        }
        delete layer.hue;
      }
      if (layer.type === LAYER_TYPES.Heatmap) {
        if (layer.hue === undefined) {
          layer.hue = 0;
        }
        delete layer.color;
      }
    });

    // get header promises
    const headersPromises = [];
    workspaceLayers
      .filter(l => LAYER_TYPES_WITH_HEADER.indexOf(l.type) > -1 && l.added === true)
      .forEach((heatmapLayer) => {
        if (HEADERLESS_LAYERS.indexOf(heatmapLayer.tilesetId) > -1) {
          // headerless layers are considered temporalExtents-less too
          heatmapLayer.header = {
            temporalExtentsLess: true,
            temporalExtents: TEMPORAL_EXTENTLESS,
            colsByName: []
          };
        } else {
          const headerPromise = loadLayerHeader(heatmapLayer.url, getState().user.token);
          headerPromise.then((header) => {
            if (header !== null) {
              if (header.temporalExtents === undefined || header.temporalExtents === null) {
                header.temporalExtents = TEMPORAL_EXTENTLESS;
                header.temporalExtentsLess = true;
              }

              heatmapLayer.header = header;
              dispatch(setGlobalFiltersFromHeader(header));
            }
          });
          headersPromises.push(headerPromise);
        }
      });

    // load custom layers data
    workspaceLayers
      .filter(l => l.type === LAYER_TYPES.Custom)
      .forEach((customLayer) => {
        dispatch(loadCustomLayer(customLayer.id, customLayer.url, customLayer.customLayerSubtype));
      });

    const headersPromise = Promise.all(headersPromises.map(p => p.catch(e => e)));
    headersPromise
      .then(() => {
        dispatch({
          type: SET_LAYERS,
          payload: workspaceLayers.filter(layer => layer.type !== LAYER_TYPES.Heatmap || layer.header !== undefined)
        });
        dispatch(updateMapStyle());
        dispatch(initHeatmapLayers());
        dispatch(refreshFlagFiltersLayers());
      })
      .catch((err) => {
        console.warn(err);
      });

    return headersPromise;
  };
}

export function toggleLayerVisibility(layerId, forceStatus = null) {
  return (dispatch, getState) => {
    const layer = getState().layers.workspaceLayers.find(l => l.id === layerId || l.tilesetId === layerId);
    if (layer === undefined) {
      console.error(
        `Attempting to toggle layer visibility for layer id "${layerId}",
        could only find ids "${getState().layers.workspaceLayers.map(l => l.id).join()}"`
      );
      return;
    }

    const visibility = (forceStatus !== null) ? forceStatus : !layer.visible;
    dispatch({
      type: TOGGLE_LAYER_VISIBILITY,
      payload: {
        layerId: layer.id,
        visibility
      }
    });

    if (layer.type === LAYER_TYPES.Heatmap && visibility === true) {
      // TODO clean tile first, if zoom has changed
      dispatch(loadAllTilesForLayer(layer.id));
    }

    if (LAYER_TYPES_MAPBOX_GL.indexOf(layer.type) > -1) {
      dispatch(updateMapStyle());
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
    if (LAYER_TYPES_MAPBOX_GL.indexOf(newLayer.type) > -1) {
      dispatch(updateMapStyle());
    }
  };
}

export function setLayerOpacity(opacity, layerId) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_LAYER_OPACITY,
      payload: {
        layerId,
        opacity
      }
    });
    const newLayer = getState().layers.workspaceLayers.find(layer => layer.id === layerId);
    if (LAYER_TYPES_MAPBOX_GL.indexOf(newLayer.type) > -1) {
      dispatch(updateMapStyle());
    }
  };
}

export function setLayerTint(color, hue, layerId) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_LAYER_TINT,
      payload: {
        layerId,
        color,
        hue
      }
    });

    const newLayer = getState().layers.workspaceLayers.find(layer => layer.id === layerId);
    if (LAYER_TYPES_MAPBOX_GL.indexOf(newLayer.type) > -1) {
      dispatch(updateMapStyle());
    }
    if (newLayer.type === LAYER_TYPES.Heatmap) {
      dispatch(refreshFlagFiltersLayers());
    }
  };
}

export function toggleLayerShowLabels(layerId) {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_LAYER_SHOW_LABELS,
      payload: {
        layerId
      }
    });
    dispatch(updateMapStyle());
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
