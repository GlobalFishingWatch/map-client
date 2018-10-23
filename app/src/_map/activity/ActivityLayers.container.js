import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { exportNativeViewport } from 'map/mapViewportActions';
import ActivityLayers from './ActivityLayers.jsx';
import { queryHeatmapVessels } from '../heatmap/heatmapTiles.actions';

const getTracks = (state, ownProps) => ownProps.tracks;
const getMapTracks = state => state.map.tracks;

const getAllTracks = createSelector(
  [getTracks, getMapTracks],
  (tracks, mapTracks) => {
    const allTracks = mapTracks.map((mapTrack) => {
      const originalTrack = tracks.find(track =>
        track.id === mapTrack.id && track.segmentId === mapTrack.segmentId
      );
      return (originalTrack === undefined) ? null : { color: originalTrack.color, ...mapTrack };
    });

    return allTracks.filter(track => track !== null);
  }
);

const mapStateToProps = (state, ownProps) => ({
  layers: state.layers.workspaceLayers,
  heatmapLayers: state.heatmap.heatmapLayers,
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes,
  timelineOverExtentIndexes: state.filters.timelineOverExtentIndexes,
  highlightedVessels: state.heatmap.highlightedVessels,
  highlightedClickedVessel: state.heatmap.highlightedClickedVessel,
  viewport: state.mapViewport.viewport,
  zoom: state.mapViewport.viewport.zoom,
  leftWorldScaled: state.mapViewport.leftWorldScaled,
  rightWorldScaled: state.mapViewport.rightWorldScaled,
  layerFilters: state.filterGroups.layerFilters,
  allTracks: getAllTracks(state, ownProps),
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
