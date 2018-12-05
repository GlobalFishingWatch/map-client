import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import convert from '@globalfishingwatch/map-convert';
import MapProxy from './MapProxy';
import { updateViewport } from './glmap/viewport.actions';
import { commitStyleUpdates } from './glmap/style.actions';
import {
  MIN_FRAME_LENGTH_MS
} from './config';

const getProvidedTracks = (state, ownProps) => ownProps.tracks;
const getModuleTracks = state => state.map.tracks;
const getProvidedHeatmapLayers = (state, ownProps) => ownProps.heatmapLayers;
const getModuleHeatmapLayers = state => state.map.heatmap.heatmapLayers;
const getTemporalExtent = (state, ownProps) => ownProps.temporalExtent;
const getHighlightTemporalExtent = (state, ownProps) => ownProps.highlightTemporalExtent;

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

const getTemporalExtentIndexes = createSelector(
  [getTemporalExtent],
  (temporalExtent) => {
    const startTimestamp = temporalExtent[0].getTime();
    const endTimestamp = Math.max(temporalExtent[1].getTime(), temporalExtent[0].getTime() + MIN_FRAME_LENGTH_MS);
    const startIndex = convert.getOffsetedTimeAtPrecision(startTimestamp);
    const endIndex = convert.getOffsetedTimeAtPrecision(endTimestamp);
    return [startIndex, endIndex];
  }
);

const getHighlightTemporalExtentIndexes = createSelector(
  [getHighlightTemporalExtent],
  (highlightTemporalExtent) => {
    const startTimestamp = highlightTemporalExtent[0].getTime();
    const endTimestamp = highlightTemporalExtent[1].getTime();
    const startIndex = convert.getOffsetedTimeAtPrecision(startTimestamp);
    const endIndex = convert.getOffsetedTimeAtPrecision(endTimestamp);
    return [startIndex, endIndex];
  }
);

const mapStateToProps = (state, ownProps) => ({
  tracks: getTracks(state, ownProps),
  heatmapLayers: getHeatmapLayers(state, ownProps),
  temporalExtentIndexes: getTemporalExtentIndexes(state, ownProps),
  highlightTemporalExtentIndexes: getHighlightTemporalExtentIndexes(state, ownProps)
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
