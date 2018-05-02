import area from '@turf/area';
import { clearVesselInfo, addVessel, hideVesselsInfoPanel } from 'vesselInfo/vesselInfoActions';
import { setEncountersInfo, clearEncountersInfo } from 'encounters/encountersActions';
import { clearHighlightedVessels } from 'activityLayers/heatmapActions';
import { zoomIntoVesselCenter } from 'map/mapViewportActions';
import { trackMapClicked } from 'analytics/analyticsActions';
import { setReportPolygon, clearReportPolygon } from 'report/reportActions';
import { LAYER_TYPES } from 'constants';
import { POLYGON_LAYERS, POLYGON_LAYERS_AREA } from 'config';

export const SET_HOVER_POPUP = 'SET_HOVER_POPUP';
export const SET_POPUP = 'SET_POPUP';
export const CLEAR_POPUP = 'CLEAR_POPUP';
export const SET_MAP_CURSOR = 'SET_MAP_CURSOR';

// gets fields for workspace layer from gl feature
const getFeaturePopupFields = (glFeature) => {
  const staticLayerId = Object.keys(POLYGON_LAYERS).find(key =>
    POLYGON_LAYERS[key].glLayers.find(glLayer => glLayer.id === glFeature.layer.id)
  );
  const popupFields = POLYGON_LAYERS[staticLayerId].popupFields;
  return { popupFields, staticLayerId };
};

const getAreaKm2 = glFeature => (10 ** -6) * area(glFeature.geometry);

const humanizePopupFieldId = (id) => {
  return id
    .replace('_', ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const clearPopup = () => (dispatch) => {
  dispatch({
    type: CLEAR_POPUP
  });
  dispatch(clearReportPolygon());
};

export const mapHover = (latitude, longitude, features) => (dispatch, getState) => {
  const currentActivityLayersInteractionData = getState().heatmap.highlightedVessels;
  const { layerId, isEmpty, foundVessels } = currentActivityLayersInteractionData;

  let hoverPopup = null;
  let cursor = null;

  if (isEmpty === true) {
    if (features.length) {
      const feature = features[0];
      const { popupFields, staticLayerId } = getFeaturePopupFields(feature);
      const mainPopupFieldId = popupFields[0].id || popupFields[0];
      const featureTitle = feature.properties[mainPopupFieldId];
      const staticLayer = getState().layers.workspaceLayers.find(l => l.id === staticLayerId);
      hoverPopup = {
        layerTitle: staticLayer.title,
        featureTitle
      };
      cursor = 'pointer';
    }
  } else {
    const layer = getState().layers.workspaceLayers.find(l => l.id === layerId);
    cursor = (foundVessels === undefined || foundVessels.length > 1) ? 'zoom-in' : 'pointer';
    let featureTitle;
    if (foundVessels === undefined || foundVessels.length > 1) {
      featureTitle = `${(foundVessels === undefined) ? 'several' : foundVessels.length} points`;
    } else {
      featureTitle = '1 point';
    }

    hoverPopup = {
      layerTitle: layer.title,
      featureTitle
    };
  }

  if (hoverPopup !== null) {
    hoverPopup = {
      ...hoverPopup,
      latitude,
      longitude
    };
  }

  dispatch({
    type: SET_HOVER_POPUP,
    payload: hoverPopup
  });

  dispatch({
    type: SET_MAP_CURSOR,
    payload: cursor
  });
};

export const mapClick = (latitude, longitude, features) => (dispatch, getState) => {
  const state = getState();

  dispatch(clearVesselInfo());
  dispatch(clearEncountersInfo());
  dispatch(clearPopup());

  const currentActivityLayersInteractionData = getState().heatmap.highlightedVessels;
  const { layerId, isEmpty, clickableCluster, foundVessels } = currentActivityLayersInteractionData;
  const layer = state.layers.workspaceLayers.find(l => l.id === layerId);

  if (isEmpty === true) {
    if (features.length) {
      const feature = features[0];

      const { popupFields, staticLayerId } = getFeaturePopupFields(feature);
      const staticLayer = getState().layers.workspaceLayers.find(l => l.id === staticLayerId);

      const layerIsInReport = state.report.layerId === staticLayerId;
      if (layerIsInReport === true) {
        dispatch(setReportPolygon(feature.properties));
      }

      const fields = popupFields.map((popupField) => {
        const id = popupField.id || popupField;
        const value = (id === POLYGON_LAYERS_AREA) ? getAreaKm2(feature) : feature.properties[id];
        const title = popupField.label || humanizePopupFieldId(id);
        return {
          title,
          value
        };
      });

      const isInReport = (layerIsInReport === true) ? state.report.currentPolygon.isInReport : null;

      dispatch({
        type: SET_POPUP,
        payload: {
          layerTitle: staticLayer.title,
          fields,
          isInReport,
          latitude,
          longitude
        }
      });
    }
  } else if (state.user.userPermissions !== null && state.user.userPermissions.indexOf('selectVessel') > -1) {
    if (clickableCluster === true) {
      dispatch(trackMapClicked(latitude, longitude, 'cluster'));
      dispatch(hideVesselsInfoPanel());
      dispatch(zoomIntoVesselCenter(latitude, longitude));
      dispatch(clearHighlightedVessels());
    } else {
      dispatch(trackMapClicked(latitude, longitude, 'vessel'));
      const selectedSeries = foundVessels[0].series;
      const selectedSeriesgroup = foundVessels[0].seriesgroup;

      if (layer.subtype === LAYER_TYPES.Encounters) {
        if (layer.header.endpoints === undefined || layer.header.endpoints.info === undefined) {
          console.warn('Info field is missing on header\'s urls, can\'t display encounters details');
        } else {
          dispatch(setEncountersInfo(selectedSeries, layer.tilesetId, layer.header.endpoints.info));
        }
      } else {
        dispatch(addVessel(layer.tilesetId, selectedSeriesgroup, selectedSeries));
      }
    }
  }
};
