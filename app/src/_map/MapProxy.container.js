import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapProxy from './MapProxy';
import { loadTrack, removeTracks } from './tracks/tracks.actions';
// TODO MAP MODULE REMOVE HEATMAP LAYER
import { addHeatmapLayer, removeHeatmapLayer } from './heatmap/heatmap.actions';
import { updateViewport } from './glmap/viewport.actions';
import { commitStyleUpdates } from './glmap/style.actions';

const getProvidedTracks = (state, ownProps) => ownProps.tracks;
const getMapTracks = state => state.map.tracks;

// Merges providedTracks (track metadata) and moduleTracks (actual track data, internal to the module)
const getAllTracks = createSelector(
  [getProvidedTracks, getMapTracks],
  (providedTracks, mapTracks) => {
    console.log(providedTracks, mapTracks)
    const allTracks = mapTracks.map((mapTrack) => {
      const originalTrack = providedTracks.find(track =>
        track.id === mapTrack.id && track.segmentId === mapTrack.segmentId
      );
      return (originalTrack === undefined) ? null : { ...originalTrack, ...mapTrack };
    });

    return allTracks.filter(track => track !== null);
  }
);

const mapStateToProps = (state, ownProps) => ({
  tracks: getAllTracks(state, ownProps)
});

const mapDispatchToProps = dispatch => ({
  updateViewport: (viewport) => {
    dispatch(updateViewport({
      latitude: viewport.center[0],
      longitude: viewport.center[1],
      ...viewport
    }));
  },
  addHeatmapLayer: (heatmapLayer) => {
    dispatch(addHeatmapLayer(heatmapLayer));
  },
  removeHeatmapLayer: (heatmapLayerId) => {
    dispatch(addHeatmapLayer(heatmapLayerId));
  },
  commitStyleUpdates: (staticLayers, basemapLayers) => {
    dispatch(commitStyleUpdates(staticLayers, basemapLayers));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapProxy);
