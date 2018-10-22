import { connect } from 'react-redux';
import MapProxy from './MapProxy';

const mapStateToProps = (state, ownProps) => ({
  zoom: state.mapViewport.zoom
  // basemap: ownProps.workspace.basemap
});

const mapDispatchToProps = dispatch => ({
  // setViewport: (viewport) => {
  //   dispatch(setViewport(viewport));
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapProxy);
