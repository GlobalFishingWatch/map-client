import { connect } from 'react-redux';
import MiniGlobe from '@globalfishingwatch/map-miniglobe-component';

const mapStateToProps = state => ({
  center: state.workspace.viewport.center,
  zoom: state.workspace.viewport.zoom,
  bounds: state.workspace.viewport.bounds
});

export default connect(mapStateToProps)(MiniGlobe);
