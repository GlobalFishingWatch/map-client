import area from '@turf/area';
import { POLYGON_LAYERS_AREA } from 'config';
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

// TODO MAP MODULE
// const humanizePopupFieldId = id => id
//   .replace(POLYGON_LAYERS_AREA, 'Est. area km²')
//   .replace('_', ' ')
//   .replace(/\b\w/g, l => l.toUpperCase());

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
        // TODO MAP MODULE
        // const staticLayer = state.layers.workspaceLayers.find(l => l.id === feature.staticLayerId);
        // hoverPopup = {
        //   layerTitle: staticLayer.title,
        //   featureTitle
        // };
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
  } else /* if (isEmpty !== true) */ {
    // if activity layers are found, and a report is not triggered on a static layer
    // const layer = state.layers.workspaceLayers.find(l => l.id === layerId);
    const isCluster = (foundVessels === undefined || foundVessels.length > 1);
    cursor = (isCluster) ? 'zoom-in' : 'pointer';
    // let featureTitle;

    // if (layer.subtype === LAYER_TYPES.Encounters) {
    //   const foundVessel = foundVessels[0];
    //   if (foundVessel.timeIndex) {
    //     const date = new Date(convert.getTimestampFromOffsetedtTimeAtPrecision(foundVessel.timeIndex));
    //     featureTitle = moment(date).format(FORMAT_DATE);
    //   }
    // } else {
    //   const numVessels = (foundVessels === undefined) ? 'multiple' : foundVessels.length;
    //   const vesselPlural = (foundVessels === undefined || foundVessels.length > 1) ? 'objects' : 'object';
    //   featureTitle = `${numVessels} ${vesselPlural} at this location`;
    // }
    // hoverPopup = {
    //   layerTitle: layer.title,
    //   featureTitle
    // };
    event.type = 'activity';
    // TODO MAP MODULE sometimes layerId is undefined, likely an issue with heatmap[Tiles]
    event.layer = layer;
    event.target = {
      objects: foundVessels,
      isCluster
    };
  }

  // if (hoverPopup !== null) {
  //   hoverPopup = {
  //     ...hoverPopup,
  //     latitude,
  //     longitude
  //   };
  // }

  // dispatch({
  //   type: SET_HOVER_POPUP,
  //   payload: hoverPopup
  // });

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
      // const staticLayer = state.layers.workspaceLayers.find(l => l.id === feature.staticLayerId);

      // const layerIsInReport = state.report.layerId === feature.staticLayerId;
      // if (metaFields === null || (FEATURE_FLAG_EXTENDED_POLYGON_LAYERS === false && layerIsInReport === false)) {
      //   return;
      // }

      let fields;
      if (metaFields !== null) {
        const properties = feature.feature.properties;
        fields = metaFields.map((metaField) => {
          const id = metaField.id || metaField;
          const value = (id === POLYGON_LAYERS_AREA) ? getAreaKm2(feature.feature) : properties[id];
          // const title = metaField.label || humanizePopupFieldId(id);
          return {
            title: metaField.label,
            value
          };
        });
      }
      // const isInReport = (layerIsInReport === true)
      //   ? report.polygons.find(polygon => polygon.reportingId === properties.reporting_id)
      //   : null;

      // dispatch({
      //   type: SET_POPUP,
      //   payload: {
      //     layerId: feature.staticLayerId,
      //     layerTitle: staticLayer.title,
      //     fields,
      //     isInReport,
      //     latitude,
      //     longitude,
      //     properties
      //   }
      // });
      event.type = 'static';
      event.layer = {
        id: feature.staticLayerId
      };
      event.target = {
        fields
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
