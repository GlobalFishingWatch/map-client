import { connect } from 'react-redux';
import MiniGlobe from 'miniglobe/components/MiniGlobe';

const mapStateToProps = state => ({
  center: state.workspace.viewport.center,
  zoom: state.workspace.viewport.zoom,
  viewportBoundsGeoJSON: state.workspace.viewport.viewportBoundsGeoJSON
});

export default connect(mapStateToProps)(MiniGlobe);
