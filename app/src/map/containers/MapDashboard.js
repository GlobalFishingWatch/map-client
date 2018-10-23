import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapDashboard from 'map/components/MapDashboard';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';
import { LAYER_TYPES } from 'constants';
import { toggleMapPanels } from 'app/appActions';

const getVessels = state => state.vesselInfo.vessels;
const getEncounter = state => state.encounters.encountersInfo;
const getLayers = state => state.layers.workspaceLayers;

const getAllVesselsForTracks = createSelector(
  [getVessels, getEncounter],
  (vessels, encounter) => {
    let tracks = [];

    vessels.forEach((vessel) => {
      if (vessel.visible === true || vessel.shownInInfoPanel === true) {
        tracks.push({
          id: vessel.seriesgroup.toString(),
          segmentId: (vessel.series) ? vessel.series.toString() : null,
          ...vessel
        });
      }
    });

    if (encounter !== null && encounter !== undefined) {
      const encountersTracks = encounter.vessels.map(encounterVessel => ({
        id: encounterVessel.seriesgroup.toString(),
        ...encounterVessel
      }));
      tracks = [...tracks, ...encountersTracks];
    }

    return tracks;
  }
);

const getHeatmapLayers = createSelector(
  [getLayers],
  layers => layers
    .filter(layer => layer.type === LAYER_TYPES.Heatmap && layer.added === true)
    .map(layer => ({
      id: layer.id
    }))
);

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  zoom: state.mapViewport.viewport.zoom,
  latitude: state.mapViewport.viewport.latitude,
  longitude: state.mapViewport.viewport.longitude,
  attributions: state.mapStyle.attributions,
  mapPanelsExpanded: state.app.mapPanelsExpanded,
  hoverPopup: state.mapInteraction.hoverPopup,
  workspace: state.workspace,
  // Map module:
  token: state.user.token,
  allVesselsForTracks: getAllVesselsForTracks(state),
  heatmapLayers: getHeatmapLayers(state)
});

const mapDispatchToProps = dispatch => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link));
  },
  onToggleMapPanelsExpanded: () => {
    dispatch(toggleMapPanels());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapDashboard);
