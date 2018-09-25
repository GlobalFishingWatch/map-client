import { connect } from 'react-redux';
import MiniGlobe from 'miniglobe/components/MiniGlobe';

const mapStateToProps = state => ({
  latitude: state.mapViewport.viewport.latitude,
  longitude: state.mapViewport.viewport.longitude,
  zoom: state.mapViewport.viewport.zoom,
  viewportBoundsGeoJSON: state.mapViewport.viewportBoundsGeoJSON
});

export default connect(mapStateToProps)(MiniGlobe);
