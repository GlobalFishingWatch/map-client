import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapDashboard from 'map/components/MapDashboard';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';
import { updateWorkspace } from 'workspace/workspaceActions';
import { startLoading, completeLoading, toggleMapPanels } from 'app/appActions';
import { LAYER_TYPES } from 'constants';

const getVessels = state => state.vesselInfo.vessels;
const getEncounter = state => state.encounters.encountersInfo;
const getLayers = state => state.layers.workspaceLayers;
const getWorkspaceZoom = state => state.workspace.zoom;
const getWorkspaceCenter = state => state.workspace.center;

const getViewport = createSelector(
  [getWorkspaceZoom, getWorkspaceCenter],
  (zoom, center) => {
    if (zoom !== undefined && center !== undefined) {
      return { zoom, center };
    }
    // TODO MAP MODULE
    // import defaultWorkspace from 'workspace/workspace';
    // defaultWorkspace.workspace.map.center
    return null;
  }
);

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
    .map((layer) => {
      const hl = {
        id: layer.id,
        url: layer.header.endpoints.tiles,
        subtype: layer.subtype,
        isPBF: layer.header.isPBF !== undefined,
        colsByName: layer.header.colsByName,
        temporalExtents: layer.header.temporalExtents,
        temporalExtentsLess: layer.header.temporalExtentsLess !== undefined
      };
      return hl;
    })
);

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  attributions: state.mapStyle.attributions,
  mapPanelsExpanded: state.app.mapPanelsExpanded,
  hoverPopup: state.mapInteraction.hoverPopup,
  workspace: state.workspace,
  // Map module:
  token: state.user.token,
  mapViewport: getViewport(state),
  mapTracks: getAllVesselsForTracks(state),
  mapHeatmapLayers: getHeatmapLayers(state)
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
  },
  onMapViewportChange: (viewport) => {
    dispatch(updateWorkspace({
      viewport
    }));
  },
  onMapLoadStart: () => {
    dispatch(startLoading());
  },
  onMapLoadComplete: () => {
    dispatch(completeLoading());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapDashboard);
