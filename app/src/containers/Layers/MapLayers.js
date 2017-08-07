import { connect } from 'react-redux';
import MapLayers from 'components/Layers/MapLayers';
import { showPolygon } from 'actions/report';
import { getTile, releaseTile, getVesselFromHeatmap, highlightVesselFromHeatmap } from 'actions/heatmap';

const mapStateToProps = state => ({
  token: state.user.token,
  zoom: state.map.zoom,
  layers: state.layers.workspaceLayers,
  flagsLayers: state.filters.flagsLayers,
  heatmap: state.heatmap.heatmapLayers,
  highlightedVessels: state.heatmap.highlightedVessels,
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes,
  timelineOuterExtent: state.filters.timelineOuterExtent,
  timelineOverExtentIndexes: state.filters.timelineOverExtentIndexes,
  timelinePaused: state.filters.timelinePaused,
  vesselTracks: state.vesselInfo.vessels,
  reportLayerId: state.report.layerId,
  reportedPolygonsIds: state.report.polygonsIds
});

const mapDispatchToProps = dispatch => ({
  showPolygon: (polygonData, latLng) => {
    dispatch(showPolygon(polygonData, latLng));
  },
  createTile: (uid, coordinates, canvas) => {
    dispatch(getTile(uid, coordinates, canvas));
  },
  releaseTile: (uid) => {
    dispatch(releaseTile(uid));
  },
  getVesselFromHeatmap: (tileQuery, latLng) => {
    dispatch(getVesselFromHeatmap(tileQuery, latLng));
  },
  highlightVesselFromHeatmap: (tileQuery, latLng) => {
    dispatch(highlightVesselFromHeatmap(tileQuery, latLng));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapLayers);
