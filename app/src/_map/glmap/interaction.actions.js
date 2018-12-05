import area from '@turf/area';
import { POLYGON_LAYERS_AREA } from '../constants';
import { clearHighlightedVessels, clearHighlightedClickedVessel } from '../heatmap/heatmap.actions';
import { zoomIntoVesselCenter } from './viewport.actions';

export const SET_HOVER_POPUP = 'SET_HOVER_POPUP';
export const SET_POPUP = 'SET_POPUP';
export const CLEAR_POPUP = 'CLEAR_POPUP';
export const SET_MAP_CURSOR = 'SET_MAP_CURSOR';
export const UPDATE_POPUP_REPORT_STATUS = 'UPDATE_POPUP_REPORT_STATUS';

const getFeatureMetaFields = (staticLayerId, state) => {
  const source = state.style.mapStyle.toJS().sources[staticLayerId];
  if (source.metadata === undefined || source.metadata['gfw:popups'] === undefined) {
    return null;
  }
  return source.metadata['gfw:popups'];
};

const getAreaKm2 = (glFeature) => {
  const areakm2 = (10 ** -6) * area(glFeature.geometry);
  const formatted = areakm2.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return formatted;
};

const getStaticLayerIdFromGlFeature = glFeature =>
  (glFeature.layer.metadata !== undefined && glFeature.layer.metadata['gfw:id']) || glFeature.layer.source;

const findFeature = (glFeatures, reportLayerId) => {
  if (!glFeatures.length) {
    return undefined;
  }
  if (reportLayerId === null) {
    // gl id might be not found if layer is custom, loop until found
    // FIXME implement popus for custom layers
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
  }
  const reportLayerFeature = glFeatures.find((glFeature) => {
    const staticLayerId = getStaticLayerIdFromGlFeature(glFeature);
    return (staticLayerId === reportLayerId);
  });
  if (reportLayerFeature !== undefined) {
    return {
      feature: reportLayerFeature,
      staticLayerId: reportLayerId
    };
  }
  return undefined;
};

export const clearPopup = () => (dispatch) => {
  dispatch({
    type: CLEAR_POPUP
  });
};

export const mapHover = (latitude, longitude, features) => (dispatch, getState) => {
  const state = getState().map;
  const currentActivityLayersInteractionData = state.heatmap.highlightedVessels;
  const { layer, isEmpty, foundVessels } = currentActivityLayersInteractionData;

  // let hoverPopup = null;
  let cursor = null;
  const event = {
    type: null
  };

  // TODO MAP MODULE take interactive param into account - could it be set directly on GL layers?
  // https://github.com/uber/react-map-gl/blob/fe1aa482a6fffe52125ad70d1bbecb223ae9bed6/docs/whats-new.md#highlights
  // https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map
  // will need to use interactiveLayerIds
  // const report = state.report;

  if (/* report.layerId !== null || */ isEmpty === true) {
    const feature = findFeature(features /* TODO MAP MODULE , report.layerId */, null);
    if (feature !== undefined) {
      // const layerIsInReport = report.layerId === feature.staticLayerId;
      const popupFields = getFeatureMetaFields(feature.staticLayerId, state);
      if (popupFields !== null) {
        const mainPopupFieldId = popupFields[0].id || popupFields[0];
        const featureTitle = feature.feature.properties[mainPopupFieldId];
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
    // if activity layers are found, and a report is not triggered on a static layer
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
  // const layer = state.layers.workspaceLayers.find(l => l.id === layerId);

  // const report = state.report;
  const event = {
    type: null
  };

  if (/* report.layerId !== null || */ isEmpty === true) {
    const feature = findFeature(features /* , report.layerId */, null);
    if (feature !== undefined) {
      const metaFields = getFeatureMetaFields(feature.staticLayerId, state);

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

// TODO MAP MODULE
export const updatePopupReportStatus = () => (dispatch, getState) => {
  const state = getState();
  const popup = state.mapInteraction.popup;
  const report = state.report;
  if (popup === null) return;

  const layerIsInReport = report.layerId === popup.layerId;
  const polygonIsInReport = (layerIsInReport === true)
    ? report.polygons.find(polygon => polygon.reportingId === popup.properties.reporting_id) !== undefined
    : null;


  dispatch({
    type: UPDATE_POPUP_REPORT_STATUS,
    payload: polygonIsInReport
  });
};
