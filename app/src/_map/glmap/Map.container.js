import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import convert from '@globalfishingwatch/map-convert';
import { mapHover, mapClick } from './interaction.actions.js';
import { setViewport, setMouseLatLong, transitionEnd } from './viewport.actions.js';
import {
  MIN_FRAME_LENGTH_MS
} from '../config';
import Map from './Map.jsx';

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
      const providedHeatmapLayer = providedHeatmapLayers.find(l =>
        l.id === moduleHeatmapLayerId
      );
      const moduleHeatmapLayer = moduleHeatmapLayers[moduleHeatmapLayerId];
      return (providedHeatmapLayer === undefined) ? null : {
        ...moduleHeatmapLayer,
        visible: providedHeatmapLayer.visible,
        hue: providedHeatmapLayer.hue,
        opacity: providedHeatmapLayer.opacity
      };
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
    if (highlightTemporalExtent === undefined) {
      return null;
    }
    const startTimestamp = highlightTemporalExtent[0].getTime();
    const endTimestamp = highlightTemporalExtent[1].getTime();
    const startIndex = convert.getOffsetedTimeAtPrecision(startTimestamp);
    const endIndex = convert.getOffsetedTimeAtPrecision(endTimestamp);
    return [startIndex, endIndex];
  }
);

const mapStateToProps = (state, ownProps) => ({
  viewport: state.map.viewport.viewport,
  maxZoom: state.map.viewport.maxZoom,
  minZoom: state.map.viewport.minZoom,
  mapStyle: state.map.style.mapStyle,
  cursor: state.map.interaction.cursor,
  tracks: getTracks(state, ownProps),
  heatmapLayers: getHeatmapLayers(state, ownProps),
  temporalExtentIndexes: getTemporalExtentIndexes(state, ownProps),
  highlightTemporalExtentIndexes: getHighlightTemporalExtentIndexes(state, ownProps)
});

const mapDispatchToProps = dispatch => ({
  setViewport: (viewport) => {
    dispatch(setViewport(viewport));
  },
  mapHover: (lat, long, features) => {
    dispatch(setMouseLatLong(lat, long));
    dispatch(mapHover(lat, long, features));
  },
  mapClick: (lat, long, features) => {
    dispatch(mapClick(lat, long, features));
  },
  transitionEnd: () => {
    dispatch(transitionEnd());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
