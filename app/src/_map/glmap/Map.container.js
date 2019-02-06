import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import convert from '@globalfishingwatch/map-convert';
import { mapHover, mapClick } from './interaction.actions.js';
import { setViewport, setMouseLatLong, transitionEnd } from './viewport.actions.js';
import {
  MIN_FRAME_LENGTH_MS
} from '../config';
import Map from './Map.jsx';

const getTemporalExtent = (state, ownProps) => ownProps.temporalExtent;
const getHighlightTemporalExtent = (state, ownProps) => ownProps.highlightTemporalExtent;

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
