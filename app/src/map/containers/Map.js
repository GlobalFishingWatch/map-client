import { connect } from 'react-redux';
import Map from 'map/components/Map.jsx';
import { setViewport, setMouseLatLong } from 'map/mapViewportActions.js';

const mapStateToProps = state => ({
  viewport: state.mapViewport.viewport,
  maxZoom: state.mapViewport.maxZoom,
  minZoom: state.mapViewport.minZoom,
  mapStyle: state.mapStyle
});

const mapDispatchToProps = dispatch => ({
  setViewport: (viewport) => {
    dispatch(setViewport(viewport));
  },
  setMouseLatLong: (lat, long) => {
    dispatch(setMouseLatLong(lat, long));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
