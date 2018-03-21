import { connect } from 'react-redux';
import Map from 'map/components/Map.jsx';
import { setViewport } from 'map/mapViewportActions.js';

const mapStateToProps = state => ({
  viewport: state.mapViewport,
  mapStyle: state.mapStyle
});

const mapDispatchToProps = dispatch => ({
  setViewport: (viewport) => {
    dispatch(setViewport(viewport));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
