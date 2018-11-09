import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { updateWorkspace } from 'workspace/workspaceActions';
import { startLoading, completeLoading } from 'app/appActions';
import { LAYER_TYPES, LAYER_TYPES_MAPBOX_GL } from 'constants';
import MapWrapper from 'map/components/MapWrapper';


const getVessels = state => state.vesselInfo.vessels;
const getEncounter = state => state.encounters.encountersInfo;
const getLayers = state => state.layers.workspaceLayers;
const getBasemap = state => state.basemap;
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
      const layerParams = {
        id: layer.id,
        url: layer.header.endpoints.tiles,
        subtype: layer.subtype,
        isPBF: layer.header.isPBF !== undefined,
        colsByName: layer.header.colsByName,
        temporalExtents: layer.header.temporalExtents,
        temporalExtentsLess: layer.header.temporalExtentsLess !== undefined,
        // TODO MAP MODULE color...
      };
      return layerParams;
    })
);

const getStaticLayers = createSelector(
  [getLayers],
  layers => layers
    .filter(layer => LAYER_TYPES_MAPBOX_GL.indexOf(layer.type) > -1)
    .map((layer) => {
      const layerParams = {
        id: layer.id,
        visible: layer.visible,
        // TODO MAP Module
        // this replaces report system
        selectedPolygons: [],
        opacity: layer.opacity,
        color: layer.color,
        showLabels: layer.showLabels
      };
      return layerParams;
    })
);

const getBasemapLayers = createSelector(
  [getBasemap],
  basemap => basemap.basemapLayers
    .map((basemapLayer) => {
      const basemapLayerParams = {
        id: basemapLayer.id,
        visible: basemapLayer.visible
      };
      return basemapLayerParams;
    })
);

const mapStateToProps = state => ({
  // attributions: state.mapStyle.attributions, TODO MAP MODULE
  token: state.user.token,
  viewport: getViewport(state),
  tracks: getAllVesselsForTracks(state),
  heatmapLayers: getHeatmapLayers(state),
  staticLayers: getStaticLayers(state),
  basemapLayers: getBasemapLayers(state),
  // TODO MAP MODULE
  hoverPopup: state.mapInteraction.hoverPopup
});

const mapDispatchToProps = dispatch => ({
  onViewportChange: (viewport) => {
    dispatch(updateWorkspace({
      viewport
    }));
  },
  onLoadStart: () => {
    dispatch(startLoading());
  },
  onLoadComplete: () => {
    dispatch(completeLoading());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);
