import { connect } from 'react-redux';
import Map from '../components/Map.jsx';

const mapStateToProps = (state, ownProps) => ({
  hello: state.test.hello,
  basemap: ownProps.workspace.basemap
});

const mapDispatchToProps = dispatch => ({
  // setViewport: (viewport) => {
  //   dispatch(setViewport(viewport));
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
