import { LAYER_TYPES_MAPBOX_GL } from 'constants';
import { GL_TRANSPARENT, STATIC_LAYERS_CARTO_ENDPOINT, STATIC_LAYERS_CARTO_TILES_ENDPOINT } from 'config';
import { fromJS } from 'immutable';
import { hexToRgba } from 'utils/colors';

export const UPDATE_MAP_STYLE = 'UPDATE_MAP_STYLE';
export const MARK_CARTO_LAYERS_AS_INSTANCIATED = 'MARK_CARTO_LAYERS_AS_INSTANCIATED';

const setMapStyle = style => ({
  type: UPDATE_MAP_STYLE,
  payload: style
});

const toggleLayerVisibility = (style, refLayer, glLayerIndex) => {
  const visibility = (refLayer.visible === true && refLayer.added === true) ? 'visible' : 'none';
  return style.setIn(['layers', glLayerIndex, 'layout', 'visibility'], visibility);
};

const updateGLLayer = (style, glLayerId, refLayer, reportPolygonsIds) => {
  const currentStyle = style.toJS();
  const currentStyleLayers = currentStyle.layers;
  let newStyle = style;

  const glLayerIndex = currentStyleLayers.findIndex(l => l.id === glLayerId);
  const glLayer = currentStyleLayers.find(l => l.id === glLayerId);

  // visibility
  newStyle = toggleLayerVisibility(newStyle, refLayer, glLayerIndex);

  // basemap layers' only allowed change is visibility, so bail here
  if (refLayer.basemap === true) {
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
    case 'symbol': {
      // TODO use metadata to set is label, or just use 'symbol' ?
      // if (glLayer.isLabelsLayer === true) {
      const parentLayerIsVisible = newStyle.getIn(['layers', glLayerIndex, 'layout', 'visibility']) === 'visible';
      const labelsVisibility = (parentLayerIsVisible && refLayer.showLabels === true) ? 'visible' : 'none';
      newStyle = newStyle.setIn(['layers', glLayerIndex, 'layout', 'visibility'], labelsVisibility);
      if (refLayer.showLabels !== true) {
        break;
      }
      // }
      newStyle = newStyle
        .setIn(['layers', glLayerIndex, 'paint', 'text-opacity'], refLayer.opacity)
        .setIn(['layers', glLayerIndex, 'paint', 'text-color'], refLayer.color);
      break;
    }
    default: {
      break;
    }
  }

  return newStyle;
};

export const addCustomGLLayer = layerId => (dispatch, getState) => {
  const state = getState();
  let style = state.mapStyle.mapStyle;
  const currentStyle = style.toJS();
  const refLayer = state.layers.workspaceLayers.find(layer => layer.id === layerId);
  const layerData = state.customLayer.layersData[refLayer.id];

  if (currentStyle.sources[refLayer.id] === undefined) {
    const source = fromJS({
      type: 'geojson',
      data: layerData
    });
    style = style.setIn(['sources', refLayer.id], source);
  }

  if (currentStyle.layers.find(glLayer => glLayer.id === refLayer.id) === undefined) {
    const glLayer = fromJS({
      id: refLayer.id,
      // FIXME detect feature type to allow displaying points/lines too?
      type: 'fill',
      source: refLayer.id,
      interactive: true,
      layout: {},
      paint: {}
    });
    style = style.set('layers', style.get('layers').concat([glLayer]));
  }

  dispatch(setMapStyle(style));
  dispatch(updateMapStyle());
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
      let style = getState().mapStyle.mapStyle;
      const currentStyle = style.toJS();
      instanciatedCartoLayers.forEach((cartoLayer) => {
        const tilesURL = STATIC_LAYERS_CARTO_TILES_ENDPOINT.replace('$LAYERGROUPID', cartoLayer.layergroupid);

        // replace gl source with a new source that use tiles provided by Carto anonymous maps API
        const newSourceId = `${cartoLayer.sourceId}-instanciated`;
        style = style.setIn(['sources', newSourceId], fromJS({
          type: 'vector',
          tiles: [tilesURL]
        }));

        // change source in all layers that are using it
        currentStyle.layers.forEach((layer, glLayerIndex) => {
          if (layer.source === cartoLayer.sourceId) {
            style = style.setIn(['layers', glLayerIndex, 'source'], newSourceId);
            style = style.setIn(['layers', glLayerIndex, 'metadata', 'gfw:id'], cartoLayer.sourceId);
          }
        });
      });

      dispatch(setMapStyle(style));
      dispatch(updateMapStyle());
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const updateMapStyle = () => (dispatch, getState) => {
  const state = getState();
  const staticAndCustomLayers = state.layers.workspaceLayers.filter(layer => LAYER_TYPES_MAPBOX_GL.indexOf(layer.type) > -1);
  const basemapLayers = state.basemap.basemapLayers;
  const layers = staticAndCustomLayers.concat(basemapLayers);

  let style = state.mapStyle.mapStyle;
  const currentStyle = style.toJS();
  const glLayers = currentStyle.layers;

  const cartoLayersToInstanciate = [];

  for (let i = 0; i < glLayers.length; i++) {
    const glLayer = glLayers[i];
    const sourceId = glLayer.source;
    const glSource = currentStyle.sources[sourceId];
    const layerId = (glLayer.metadata !== undefined && glLayer.metadata['gfw:id']) || sourceId;

    const refLayer = layers.find(l => l.id === layerId);

    if (refLayer === undefined) {
      if (glLayer.type !== 'background') {
        // console.warn('gl layer does not exists in workspace', glLayer);
      }
      continue;
    }

    // check if layer is served from Carto, which means we need to instanciate it first
    const sourceCartoSQL = glSource.metadata !== undefined && glSource.metadata['gfw:carto-sql'];
    if (sourceCartoSQL !== false) {
      // only if layer is visible and has not been instanciated yet
      const cartoLayerInstanciated = state.mapStyle.cartoLayersInstanciated.indexOf(sourceId) > -1;
      if (refLayer.visible === true && !cartoLayerInstanciated && !cartoLayersToInstanciate.find(l => l.sourceId === sourceId)) {
        cartoLayersToInstanciate.push({ sourceId, sourceCartoSQL });
      }
      continue;
    }

    const layerIsInReport = refLayer.id === state.report.layerId;
    const reportPolygonIds = (layerIsInReport) ? state.report.polygons.map(l => l.reportingId) : null;
    style = updateGLLayer(style, glLayer.id, refLayer, reportPolygonIds);
  }

  if (cartoLayersToInstanciate.length) {
    dispatch(instanciateCartoLayers(cartoLayersToInstanciate));
  }

  dispatch(setMapStyle(style));
};
