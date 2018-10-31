import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { exportNativeViewport } from '../glmap/viewport.actions';
import ActivityLayers from './ActivityLayers.jsx';
import { queryHeatmapVessels } from '../heatmap/heatmapTiles.actions';

const getProvidedTracks = (state, ownProps) => ownProps.providedTracks;
const getMapTracks = state => state.map.tracks;

// Merges providedTracks (track metadata) and moduleTracks (actual track data, internal to the module)
const getAllTracks = createSelector(
  [getProvidedTracks, getMapTracks],
  (providedTracks, mapTracks) => {
    const allTracks = mapTracks.map((mapTrack) => {
      const originalTrack = providedTracks.find(track =>
        track.id === mapTrack.id && track.segmentId === mapTrack.segmentId
      );
      return (originalTrack === undefined) ? null : { color: originalTrack.color, ...mapTrack };
    });

    return allTracks.filter(track => track !== null);
  }
);

const mapStateToProps = (state, ownProps) => ({
  layers: state.layers.workspaceLayers,
  heatmapLayers: state.map.heatmap.heatmapLayers,
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes,
  timelineOverExtentIndexes: state.filters.timelineOverExtentIndexes,
  highlightedVessels: state.map.heatmap.highlightedVessels,
  highlightedClickedVessel: state.map.heatmap.highlightedClickedVessel,
  viewport: state.map.viewport.viewport,
  zoom: state.map.viewport.viewport.zoom,
  leftWorldScaled: state.map.viewport.leftWorldScaled,
  rightWorldScaled: state.map.viewport.rightWorldScaled,
  layerFilters: state.filterGroups.layerFilters,
  allTracks: getAllTracks(state, ownProps),
  // TODO MAP MODULE
  highlightedTrack: state.vesselInfo.highlightedTrack
});

const mapDispatchToProps = dispatch => ({
  queryHeatmapVessels: (coords) => {
    dispatch(queryHeatmapVessels(coords));
  },
  exportNativeViewport: (viewport) => {
    dispatch(exportNativeViewport(viewport));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLayers);
