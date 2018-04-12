import { clearVesselInfo, addVessel, hideVesselsInfoPanel } from 'vesselInfo/vesselInfoActions';
import { setEncountersInfo, clearEncountersInfo } from 'encounters/encountersActions';
import { clearHighlightedVessels } from 'activityLayers/heatmapActions';
import { zoomIntoVesselCenter } from 'map/mapViewportActions';
import { trackMapClicked } from 'analytics/analyticsActions';
import { LAYER_TYPES } from 'constants';

export const mapHover = (latitude, longitude, features) => {
  return (dispatch, getState) => {
    const currentActivityLayersVessels = getState().heatmap.highlightedVessels.foundVessels;
    if (currentActivityLayersVessels === undefined && features.length) {
      console.log('highlight poly', features[0]);
    }
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
