import { connect } from 'react-redux';
import Map from 'map/components/Map.jsx';
import { setViewport, setMouseLatLong, transitionEnd } from 'map/mapViewportActions.js';
import { mapHover, mapClick } from 'map/mapInteractionActions.js';

const mapStateToProps = state => ({
  viewport: state.mapViewport.viewport,
  maxZoom: state.mapViewport.maxZoom,
  minZoom: state.mapViewport.minZoom,
  mapStyle: state.mapStyle.mapStyle,
  hoverPopup: state.mapInteraction.hoverPopup
});

const mapDispatchToProps = dispatch => ({
  setViewport: (viewport) => {
    dispatch(setViewport(viewport));
  },
  mapHover: (lat, long, features) => {
    dispatch(setMouseLatLong(lat, long));
    dispatch(mapHover(lat, long, features));
  },
  mapClick: (lat, long, features) => {
    dispatch(mapClick(lat, long, features));
  },
  transitionEnd: () => {
    dispatch(transitionEnd());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
