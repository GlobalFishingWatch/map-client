import { connect } from 'react-redux';
import MapProxy from './MapProxy';
import { initModule } from './module/module.actions';
import { loadTrack, removeTracks } from './tracks/tracks.actions';
// TODO MAP MODULE REMOVE HEATMAP LAYER
import { addHeatmapLayer, removeHeatmapLayer } from './heatmap/heatmap.actions';
import { updateViewport } from './glmap/viewport.actions';

const mapStateToProps = (state, ownProps) => ({
  
});

const mapDispatchToProps = dispatch => ({
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapProxy);
