import { fromJS } from 'immutable';
import { hexToRgba } from '@globalfishingwatch/map-colors';
import { STATIC_LAYERS_CARTO_ENDPOINT, STATIC_LAYERS_CARTO_TILES_ENDPOINT } from '../config';
import { GL_TRANSPARENT, CUSTOM_LAYERS_SUBTYPES } from '../constants';
import getMainGeomType from '../utils/getMainGeomType';

export const INIT_MAP_STYLE = 'INIT_MAP_STYLE';
export const SET_MAP_STYLE = 'SET_MAP_STYLE';
export const MARK_CARTO_LAYERS_AS_INSTANCIATED = 'MARK_CARTO_LAYERS_AS_INSTANCIATED';

export const initStyle = ({ glyphsPath }) => ({
  type: INIT_MAP_STYLE,
  payload: {
    glyphsPath
  }
});

const setMapStyle = style => ({
  type: SET_MAP_STYLE,
  payload: style
});

const toggleLayerVisibility = (style, refLayer, glLayerIndex) => {
  const visibility = (refLayer.visible === true) ? 'visible' : 'none';
  return style.setIn(['layers', glLayerIndex, 'layout', 'visibility'], visibility);
};

const updateGLLayer = (style, glLayerId, refLayer, reportPolygonsIds = null) => {
  const currentStyle = style.toJS();
  const currentStyleLayers = currentStyle.layers;
  let newStyle = style;

  const glLayerIndex = currentStyleLayers.findIndex(l => l.id === glLayerId);
  const glLayer = currentStyleLayers.find(l => l.id === glLayerId);

  // visibility
  newStyle = toggleLayerVisibility(newStyle, refLayer, glLayerIndex);

  // basemap layers' only allowed change is visibility, so bail here
  if (glLayer.type === 'raster') {
    return newStyle;
  }

  // color/opacity
  switch (glLayer.type) {
    case 'fill': {
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'fill-opacity'], refLayer.opacity)
        .setIn(['layers', glLayerIndex, 'paint', 'fill-outline-color'], refLayer.color);

      let fillColor;
      if (reportPolygonsIds === null || !reportPolygonsIds.length) {
        fillColor = GL_TRANSPARENT;
      } else {
        const reportedFillColor = hexToRgba(refLayer.color, 0.5);
        fillColor = [
          'match',
          [
            'get',
            'reporting_id'
          ]
        ];

        // [value, color, value, color, default color]
        reportPolygonsIds.forEach((id) => {
          fillColor.push(id);
          fillColor.push(reportedFillColor);
        });
        fillColor.push(GL_TRANSPARENT);
      }
      newStyle = newStyle.setIn(['layers', glLayerIndex, 'paint', 'fill-color'], fillColor);
      break;
    }
    case 'line': {
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'line-opacity'], refLayer.opacity)
        .setIn(['layers', glLayerIndex, 'paint', 'line-color'], refLayer.color);
      break;
    }
    // Symbol layers are only used for labels layers (they exist on the GL style but not in workspace)
    case 'symbol': {
      const parentLayerIsVisible = newStyle.getIn(['layers', glLayerIndex, 'layout', 'visibility']) === 'visible';
      const labelsVisibility = (parentLayerIsVisible && refLayer.showLabels === true) ? 'visible' : 'none';
      newStyle = newStyle.setIn(['layers', glLayerIndex, 'layout', 'visibility'], labelsVisibility);
      if (refLayer.showLabels !== true) {
        break;
      }
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'text-opacity'], refLayer.opacity)
        .setIn(['layers', glLayerIndex, 'paint', 'text-color'], refLayer.color);
      break;
    }
    // This is only used for custom layers with point geom types
    case 'circle': {
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'circle-opacity'], refLayer.opacity)
        .setIn(['layers', glLayerIndex, 'paint', 'circle-color'], refLayer.color);
      break;
    }
    case 'raster': {
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'raster-opacity'], refLayer.opacity);
      break;
    }
    default: {
      break;
    }
  }

  return newStyle;
};

export const addCustomGLLayer = (subtype, layerId, url, data) => (dispatch, getState) => {
  const state = getState();
  let style = state.map.style.mapStyle;
  const currentStyle = style.toJS();

  if (currentStyle.sources[layerId] === undefined) {
    const source = { type: subtype };
    if (subtype === CUSTOM_LAYERS_SUBTYPES.geojson) {
      source.data = data;
    } else if (subtype === CUSTOM_LAYERS_SUBTYPES.raster) {
      source.tiles = [url];
      source.tileSize = 256;
    }
    style = style.setIn(['sources', layerId], fromJS(source));
  }

  if (currentStyle.layers.find(glLayer => glLayer.id === layerId) === undefined) {
    const glType = (subtype === CUSTOM_LAYERS_SUBTYPES.geojson) ? getMainGeomType(data) : subtype;
    const glLayer = fromJS({
      id: layerId,
      source: layerId,
      type: glType,
      interactive: subtype === CUSTOM_LAYERS_SUBTYPES.geojson,
      layout: {},
      paint: {}
    });
    const layerIndex = (subtype === CUSTOM_LAYERS_SUBTYPES.raster)
      // if raster, put at index of last raster layer except labels
      ? currentStyle.layers.length - 1 - currentStyle.layers.filter(l => l.id !== 'labels').reverse().findIndex(l => l.type === 'raster')
      : currentStyle.layers.length - 1;
    style = style.set('layers', style.get('layers').splice(layerIndex, 0, glLayer));
  }

  dispatch(setMapStyle(style));

  // TODO MAP MODULE
  // dispatch(updateMapStyle());
};

const addWorkspaceGLLayers = workspaceGLLayers => (dispatch, getState) => {
  const state = getState();
  let style = state.map.style.mapStyle;

  workspaceGLLayers.forEach((workspaceGLLayer) => {
    const id = workspaceGLLayer.id;
    const gl = workspaceGLLayer.gl;
    const finalSource = fromJS(gl.source);
    style = style.setIn(['sources', id], finalSource);

    const layers = [];
    gl.layers.forEach((srcGlLayer) => {
      const glLayer = {
        ...srcGlLayer,
        source: id,
        'source-layer': id
      };
      layers.push(glLayer);
    });

    const finalLayers = fromJS(layers);
    style = style.set('layers', style.get('layers').concat(finalLayers));
  });

  dispatch(setMapStyle(style));

  // TODO MAP MODULE
  // dispatch(updateMapStyle());
};

const getCartoLayerInstanciatePromise = ({ sourceId, sourceCartoSQL }) => {
  const mapConfig = { layers: [{ id: sourceId, options: { sql: sourceCartoSQL } }] };
  const mapConfigURL = encodeURIComponent(JSON.stringify(mapConfig));
  const cartoAnonymousMapUrl = STATIC_LAYERS_CARTO_ENDPOINT.replace('$MAPCONFIG', mapConfigURL);

  return new Promise((resolve) => {
    fetch(cartoAnonymousMapUrl)
      .then((res) => {
        if (res.status >= 400) {
          console.warn(`loading of layer failed ${sourceId}`);
          Promise.reject();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        resolve({
          layergroupid: data.layergroupid,
          sourceId
        });
      }).catch((err) => {
        console.warn(err);
      });
  });
};

const instanciateCartoLayers = layers => (dispatch, getState) => {
  dispatch({
    type: MARK_CARTO_LAYERS_AS_INSTANCIATED,
    payload: layers.map(layer => layer.sourceId)
  });
  const cartoLayersPromises = layers.map(layer => getCartoLayerInstanciatePromise(layer));
  const cartoLayersPromisesPromise = Promise.all(cartoLayersPromises.map(p => p.catch(e => e)));
  cartoLayersPromisesPromise
    .then((instanciatedCartoLayers) => {
      let style = getState().map.style.mapStyle;
      const currentStyle = style.toJS();
      instanciatedCartoLayers.forEach((cartoLayer) => {
        const tilesURL = STATIC_LAYERS_CARTO_TILES_ENDPOINT.replace('$LAYERGROUPID', cartoLayer.layergroupid);

        // replace gl source with a new source that use tiles provided by Carto anonymous maps API
        const newSourceId = `${cartoLayer.sourceId}-instanciated`;
        style = style.setIn(['sources', newSourceId], fromJS({
          type: 'vector',
          tiles: [tilesURL]
        }));

        // change source in all layers that are using it (genrally polygon + labels)
        currentStyle.layers.forEach((glLayer, glLayerIndex) => {
          if (glLayer.source === cartoLayer.sourceId) {
            style = style.setIn(['layers', glLayerIndex, 'source'], newSourceId);
            style = style.setIn(['layers', glLayerIndex, 'metadata', 'gfw:id'], cartoLayer.sourceId);
            const refLayer = layers.find(l => l.refLayer.id === cartoLayer.sourceId).refLayer;
            style = updateGLLayer(style, glLayer.id, refLayer, /* reportPolygonIds */);
          }
        });
      });

      dispatch(setMapStyle(style));
    })
    .catch((err) => {
      console.warn(err);
    });
};

// TODO MAP MODULE instead of using static + custom + basemap from store, send as arguments to this?
export const commitStyleUpdates = (staticLayers, basemapLayers) => (dispatch, getState) => {
  const state = getState().map.style;
  const layers = [...staticLayers, ...basemapLayers];

  let style = state.mapStyle;
  const currentStyle = style.toJS();
  const glLayers = currentStyle.layers;
  const glSources = currentStyle.sources;

  // TODO MAP MODULE: do it at the same time than carto layers?
  // collect layers declared in workspace but not in original gl style
  // const workspaceGLLayers = layers.filter(layer => layer.gl !== undefined && glSources[layer.id] === undefined);
  // if (workspaceGLLayers.length) {
  //   dispatch(addWorkspaceGLLayers(workspaceGLLayers));
  //   return;
  // }

  const cartoLayersToInstanciate = [];

  for (let i = 0; i < glLayers.length; i++) {
    const glLayer = glLayers[i];
    const sourceId = glLayer.source;
    const glSource = glSources[sourceId];
    const layerId = (glLayer.metadata !== undefined && glLayer.metadata['gfw:id']) || sourceId;

    const refLayer = layers.find(l => l.id === layerId);

    if (refLayer === undefined) {
      if (glLayer.type !== 'background') {
        // console.warn('gl layer does not exists in workspace', glLayer);
      }
      continue;
    }

    // check if layer is served from Carto, which means we need to instanciate it first
    // TODO BUG: check if layer is not instanciatING too
    const sourceCartoSQL = glSource.metadata !== undefined && glSource.metadata['gfw:carto-sql'];
    if (sourceCartoSQL !== false) {
      // only if layer is visible and has not been instanciated yet
      const cartoLayerInstanciated = state.cartoLayersInstanciated.indexOf(sourceId) > -1;
      if (refLayer.visible === true && !cartoLayerInstanciated && !cartoLayersToInstanciate.find(l => l.sourceId === sourceId)) {
        cartoLayersToInstanciate.push({ sourceId, sourceCartoSQL, refLayer });
      }
      continue;
    }

    // TODO MAP MODULE use input static layers polygons
    // const layerIsInReport = refLayer.id === state.report.layerId;
    // const reportPolygonIds = (layerIsInReport) ? state.report.polygons.map(l => l.reportingId) : null;
    style = updateGLLayer(style, glLayer.id, refLayer, /* reportPolygonIds */);
  }

  if (cartoLayersToInstanciate.length) {
    dispatch(instanciateCartoLayers(cartoLayersToInstanciate));
  }

  dispatch(setMapStyle(style));
};

export const applyTemporalExtent = temporalExtent => (dispatch, getState) => {
  const state = getState().map.style;
  let style = state.mapStyle;
  const currentStyle = style.toJS();
  const glLayers = currentStyle.layers;

  const start = Math.round(temporalExtent[0].getTime() / 1000);
  const end = Math.round(temporalExtent[1].getTime() / 1000);

  for (let i = 0; i < glLayers.length; i++) {
    const glLayer = glLayers[i];
    if (glLayer.metadata === undefined || glLayer.metadata['gfw:temporal'] !== true) {
      continue;
    }
    const currentFilter = style.getIn(['layers', i, 'filter']).toJS();
    currentFilter[1][2] = start;
    currentFilter[2][2] = end;
    style = style.setIn(['layers', i, 'filter'], fromJS(currentFilter));
  }
  dispatch(setMapStyle(style));
};

