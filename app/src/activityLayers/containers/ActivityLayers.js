import { connect } from 'react-redux';
import ActivityLayers from 'activityLayers/components/ActivityLayers.jsx';
import { queryHeatmapVessels } from 'activityLayers/heatmapTilesActions';

const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers,
  heatmapLayers: state.heatmap.heatmapLayers,
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes,
  timelineOverExtentIndexes: state.filters.timelineOverExtentIndexes,
  highlightedVessels: state.heatmap.highlightedVessels,
  highlightedClickedVessel: state.heatmap.highlightedClickedVessel,
  zoom: state.mapViewport.viewport.zoom,
  layerFilters: state.filterGroups.layerFilters,
  vesselTracks: state.vesselInfo.vessels,
  tracks: state.tracks.tracks
});

const mapDispatchToProps = dispatch => ({
  queryHeatmapVessels: (coords) => {
    dispatch(queryHeatmapVessels(coords));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLayers);
