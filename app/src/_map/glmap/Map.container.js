import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import convert from '@globalfishingwatch/map-convert';
import { mergeDeep, fromJS } from 'immutable';
import { closePopup } from '../module/module.actions.js';
import { getTracksStyles } from '../tracks/tracks.selectors.js';
import { mapHover, mapClick } from './interaction.actions.js';
import { setViewport, transitionEnd } from './viewport.actions.js';
import {
  MIN_FRAME_LENGTH_MS
} from '../config';
import Map from './Map.jsx';

const getTemporalExtent = (state, ownProps) => ownProps.temporalExtent;
const getHighlightTemporalExtent = (state, ownProps) => ownProps.highlightTemporalExtent;
const getStaticLayers = state => state.map.style.staticLayers;

// TODO MAP MODULE move those selectors to separated actions/reducer
// thus avoiding passing temporal extents through Map to ActivityLayers
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

const getInteractiveLayerIds = createSelector(
  [getStaticLayers],
  // Note: here we assume that layer IDs provided with module match the GL layers that should
  // be interactive or not, ie typically the fill layer if a label layer is present
  staticLayers => staticLayers.filter(l => l.interactive === true && l.visible === true).map(l => l.id)
);

const getMapStyles = state => state.map.style.mapStyle;
const getMapStyle = createSelector(
  [getMapStyles, getTracksStyles],
  (mapStyles, trackStyles) => {
    if (!trackStyles) return mapStyles;

    return mergeDeep(mapStyles, fromJS(trackStyles));
  }
);

const mapStateToProps = (state, ownProps) => ({
  viewport: state.map.viewport.viewport,
  maxZoom: state.map.viewport.maxZoom,
  minZoom: state.map.viewport.minZoom,
  cursor: state.map.interaction.cursor,
  mapStyle: getMapStyle(state),
  temporalExtentIndexes: getTemporalExtentIndexes(state, ownProps),
  highlightTemporalExtentIndexes: getHighlightTemporalExtentIndexes(state, ownProps),
  interactiveLayerIds: getInteractiveLayerIds(state)
});

const mapDispatchToProps = dispatch => ({
  setViewport: (viewport) => {
    dispatch(setViewport(viewport));
  },
  mapHover: (lat, long, features) => {
    dispatch(mapHover(lat, long, features));
  },
  mapClick: (lat, long, features) => {
    dispatch(mapClick(lat, long, features));
  },
  transitionEnd: () => {
    dispatch(transitionEnd());
  },
  onClosePopup: () => {
    dispatch(closePopup());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
