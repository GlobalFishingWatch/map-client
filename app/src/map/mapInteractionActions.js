import { clearVesselInfo, addVessel, hideVesselsInfoPanel } from 'vesselInfo/vesselInfoActions';
import { setEncountersInfo, clearEncountersInfo } from 'encounters/encountersActions';
import { clearHighlightedVessels } from 'activityLayers/heatmapActions';
import { zoomIntoVesselCenter } from 'map/mapViewportActions';
import { trackMapClicked } from 'analytics/analyticsActions';
import { LAYER_TYPES } from 'constants';
import { POLYGON_LAYERS } from 'config';

export const SET_HOVER_POPUP = 'SET_HOVER_POPUP';
export const SET_CLICK_POPUP = 'SET_CLICK_POPUP';

export const mapHover = (latitude, longitude, features) => {
  return (dispatch, getState) => {
    const currentActivityLayersInteractionData = getState().heatmap.highlightedVessels;
    const { layerId, isEmpty, foundVessels } = currentActivityLayersInteractionData;

    let hoverPopup = null;

    if (isEmpty === true) {
      if (features.length) {
        const feature = features[0];
        const originalLayerId = Object.keys(POLYGON_LAYERS).find(key =>
          POLYGON_LAYERS[key].glLayers.find(glLayer => glLayer.id === feature.layer.id)
        );
        const layer = getState().layers.workspaceLayers.find(l => l.id === originalLayerId);
        const fields = POLYGON_LAYERS[originalLayerId].popupFields;
        const featureTitle = feature.properties[fields[0]];
        hoverPopup = {
          layerTitle: layer.title,
          featureTitle
        };
      }
    } else {
      const layer = getState().layers.workspaceLayers.find(l => l.id === layerId);
      const num = (foundVessels === undefined) ? 'several' : foundVessels.length;
      hoverPopup = {
        layerTitle: layer.title,
        featureTitle: `${num} vessels`
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
  };
};

export const mapClick = (latitude, longitude, features) => {
  return (dispatch, getState) => {

    const state = getState();

    dispatch(clearVesselInfo());
    dispatch(clearEncountersInfo());

    const currentActivityLayersInteractionData = getState().heatmap.highlightedVessels;
    const { layerId, isEmpty, clickableCluster, foundVessels } = currentActivityLayersInteractionData;
    const layer = state.layers.workspaceLayers.find(l => l.id === layerId);

    if (isEmpty === true) {
      if (features.length) {
        console.log('select feature', features[0]);
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
};
