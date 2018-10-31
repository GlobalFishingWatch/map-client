import { connect } from 'react-redux';
import MapProxy from './MapProxy';
import { initModule } from './module/module.actions';
import { loadTrack, removeTracks } from './tracks/tracks.actions';
// TODO MAP MODULE REMOVE HEATMAP LAYER
import { addHeatmapLayer, removeHeatmapLayer } from './heatmap/heatmap.actions';
import { updateViewport } from './glmap/viewport.actions';
import { commitStyleUpdates } from './glmap/style.actions';

const mapStateToProps = (state, ownProps) => ({
  
});

const mapDispatchToProps = dispatch => ({
  // TODO MAP MODULE Remove - just dispatch initModule on index when provided props are ready
  initModule: (props) => {
    dispatch(initModule(props));
  },
  updateViewport: (viewport) => {
    dispatch(updateViewport({
      latitude: viewport.center[0],
      longitude: viewport.center[1],
      ...viewport
    }));
  },
  loadTrack: (track) => {
    dispatch(loadTrack(track));
  },
  removeTrack: (track) => {
    dispatch(removeTracks([track]));
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
