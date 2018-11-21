import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapProxy from './MapProxy';
import { updateViewport } from './glmap/viewport.actions';
import { commitStyleUpdates } from './glmap/style.actions';

const getProvidedTracks = (state, ownProps) => ownProps.tracks;
const getModuleTracks = state => state.map.tracks;
const getProvidedHeatmapLayers = (state, ownProps) => ownProps.heatmapLayers;
const getModuleHeatmapLayers = state => state.map.heatmap.heatmapLayers;

// Merges providedTracks (track metadata) and moduleTracks (actual track data, internal to the module)
const getTracks = createSelector(
  [getProvidedTracks, getModuleTracks],
  (providedTracks, moduleTracks) => {
    const tracks = moduleTracks.map((moduleTrack) => {
      const providedTrack = providedTracks.find(track =>
        track.id === moduleTrack.id && track.segmentId === moduleTrack.segmentId
      );
      return (providedTrack === undefined) ? null : { ...providedTrack, ...moduleTrack };
    });

    return tracks.filter(track => track !== null);
  }
);

const getHeatmapLayers = createSelector(
  [getProvidedHeatmapLayers, getModuleHeatmapLayers],
  (providedHeatmapLayers, moduleHeatmapLayers) => {
    const heatmapLayers = Object.keys(moduleHeatmapLayers).map((moduleHeatmapLayerId) => {
      const providedheatmapLayer = providedHeatmapLayers.find(providedHeatmapLayer =>
        providedHeatmapLayer.id === moduleHeatmapLayerId
      );
      const moduleHeatmapLayer = moduleHeatmapLayers[moduleHeatmapLayerId];
      return (providedheatmapLayer === undefined) ? null : { ...providedheatmapLayer, ...moduleHeatmapLayer };
    });

    return heatmapLayers.filter(heatmapLayer => heatmapLayer !== null);
  }
);

const mapStateToProps = (state, ownProps) => ({
  tracks: getTracks(state, ownProps),
  heatmapLayers: getHeatmapLayers(state, ownProps)
});

const mapDispatchToProps = dispatch => ({
  updateViewport: (viewport) => {
    dispatch(updateViewport({
      latitude: viewport.center[0],
      longitude: viewport.center[1],
      ...viewport
    }));
  },
  commitStyleUpdates: (staticLayers, basemapLayers) => {
    dispatch(commitStyleUpdates(staticLayers, basemapLayers));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapProxy);
