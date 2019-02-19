import area from '@turf/area';
import { POLYGON_LAYERS_AREA } from '../constants';
import { clearHighlightedVessels, clearHighlightedClickedVessel } from '../heatmap/heatmap.actions';
import { zoomIntoVesselCenter } from './viewport.actions';

export const SET_POPUP = 'SET_POPUP';
export const CLEAR_POPUP = 'CLEAR_POPUP';
export const SET_MAP_CURSOR = 'SET_MAP_CURSOR';
export const UPDATE_POPUP_REPORT_STATUS = 'UPDATE_POPUP_REPORT_STATUS';

const getFeatureMetaFields = (staticLayerId, state, feature) => {
  const source = state.style.mapStyle.toJS().sources[staticLayerId];
  if (source.type !== 'geojson') {
    if (source.metadata === undefined || source.metadata['gfw:popups'] === undefined) {
      return null;
    }
    return source.metadata['gfw:popups'];
  }
  // when layer is of type geojson (custom layer), use all feature properties available
  return (Object.keys(feature.properties).length === 0)
    ? null
    : Object.keys(feature.properties).map(key => ({ id: key }));
};

const getAreaKm2 = (glFeature) => {
  const areakm2 = (10 ** -6) * area(glFeature.geometry);
  const formatted = areakm2.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return formatted;
};

const getStaticLayerIdFromGlFeature = glFeature =>
  (glFeature.layer.metadata !== undefined && glFeature.layer.metadata['gfw:id']) || glFeature.layer.source;

const findFeature = (glFeatures) => {
  if (glFeatures === undefined || !glFeatures.length) {
    return undefined;
  }
  for (let i = 0; i < glFeatures.length; i++) {
    const glFeature = glFeatures[i];
    const staticLayerId = getStaticLayerIdFromGlFeature(glFeature);
    if (staticLayerId !== undefined) {
      return {
        feature: glFeature,
        staticLayerId
      };
    }
  }
  return undefined;
};

export const mapHover = (latitude, longitude, features) => (dispatch, getState) => {
  const state = getState().map;
  const currentActivityLayersInteractionData = state.heatmap.highlightedVessels;
  const { layer, isEmpty, foundVessels } = currentActivityLayersInteractionData;

  let cursor = null;
  const event = {
    type: null
  };

  if (isEmpty === true) {
    const feature = findFeature(features, null);
    if (feature !== undefined) {
      const popupFields = getFeatureMetaFields(feature.staticLayerId, state, feature.feature);
      if (popupFields !== null) {
        const properties = feature.feature.properties;
        const mainPopupField =
          popupFields.find(f => f.id && f.id.toLowerCase() === 'name') ||
          popupFields.find(f => f.id && f.id.toLowerCase() === 'id') ||
          popupFields.find(f =>
            f.id && properties[f.id] !== null && properties[f.id] !== 'null' && properties[f.id] !== undefined
          );
        const mainPopupFieldId = mainPopupField.id;
        const featureTitle = properties[mainPopupFieldId];
        event.type = 'static';
        event.layer = {
          id: feature.staticLayerId
        };
        event.target = {
          featureTitle
        };
        cursor = 'pointer';
      }
    }
  } else if (isEmpty !== true) {
    const isCluster = (foundVessels === undefined || foundVessels.length > 1);
    cursor = (isCluster) ? 'zoom-in' : 'pointer';

    event.type = 'activity';
    // TODO MAP MODULE sometimes layerId is undefined, likely an issue with heatmap[Tiles]
    event.layer = layer;
    event.target = {
      objects: foundVessels,
      isCluster
    };
  }

  dispatch({
    type: SET_MAP_CURSOR,
    payload: cursor
  });

  if (state.module.onHover) {
    state.module.onHover({
      ...event,
      latitude,
      longitude
    });
  }
};

export const mapClick = (latitude, longitude, features) => (dispatch, getState) => {
  const state = getState().map;

  dispatch(clearHighlightedClickedVessel());

  const currentActivityLayersInteractionData = state.heatmap.highlightedVessels;

  const { layer, isEmpty, clickableCluster, foundVessels }
    = currentActivityLayersInteractionData;

  const event = {
    type: null
  };

  if (isEmpty === true) {
    const feature = findFeature(features, null);
    if (feature !== undefined) {
      const metaFields = getFeatureMetaFields(feature.staticLayerId, state, feature.feature);

      let fields;
      const properties = feature.feature.properties;
      if (metaFields !== null) {
        fields = metaFields.map((metaField) => {
          const id = metaField.id || metaField;
          const value = (id === POLYGON_LAYERS_AREA) ? getAreaKm2(feature.feature) : properties[id];
          return {
            title: metaField.label || metaField.id,
            value
          };
        });
      }

      event.type = 'static';
      event.layer = {
        id: feature.staticLayerId
      };
      event.target = {
        fields,
        properties
      };
    }
  } else {
    event.type = 'activity';
    event.layer = layer;
    if (clickableCluster === true) {
      dispatch(zoomIntoVesselCenter(latitude, longitude));
      dispatch(clearHighlightedVessels());
      event.target = {
        isCluster: true
      };
    } else {
      event.target = foundVessels[0];
    }
  }

  if (state.module.onClick) {
    state.module.onClick({
      ...event,
      latitude,
      longitude
    });
  }
};
