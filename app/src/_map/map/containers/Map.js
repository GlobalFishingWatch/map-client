import { connect } from 'react-redux';
import Map from '../components/Map.jsx';
import { setViewport, setMouseLatLong, transitionEnd } from '../mapViewportActions.js';
import { mapHover, mapClick, clearPopup } from '../mapInteractionActions.js';

const mapStateToProps = state => ({
  viewport: state.mapViewport.viewport,
  maxZoom: state.mapViewport.maxZoom,
  minZoom: state.mapViewport.minZoom,
  mapStyle: state.mapStyle.mapStyle,
  popup: state.mapInteraction.popup,
  hoverPopup: state.mapInteraction.hoverPopup,
  cursor: state.mapInteraction.cursor
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
  },
  clearPopup: () => {
    dispatch(clearPopup());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
