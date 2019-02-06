import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { exportNativeViewport } from '../glmap/viewport.actions';
import ActivityLayers from './ActivityLayers.jsx';
import { queryHeatmapVessels } from '../heatmap/heatmapTiles.actions';

const getHeatmapLayers = state => state.map.heatmap.heatmapLayers;

const getHeatmapLayersAsArray = createSelector(
  [getHeatmapLayers],
  (heatmapLayers) => {
    const a = Object.keys(heatmapLayers).map(id => ({
      ...heatmapLayers[id]
    }));
    console.log(a)
    return a;
  }
);

const mapStateToProps = state => ({
  highlightedVessels: state.map.heatmap.highlightedVessels,
  highlightedClickedVessel: state.map.heatmap.highlightedClickedVessel,
  viewport: state.map.viewport.viewport,
  zoom: state.map.viewport.viewport.zoom,
  heatmapLayers: getHeatmapLayersAsArray(state),
  leftWorldScaled: state.map.viewport.leftWorldScaled,
  rightWorldScaled: state.map.viewport.rightWorldScaled
  // highlightedTrack: state.vesselInfo.highlightedTrack
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  queryHeatmapVessels: (coords) => {
    dispatch(queryHeatmapVessels(coords, ownProps.temporalExtentIndexes));
  },
  exportNativeViewport: (viewport) => {
    dispatch(exportNativeViewport(viewport));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLayers);
