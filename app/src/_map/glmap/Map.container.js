import { connect } from 'react-redux';
import { setViewport, setMouseLatLong, transitionEnd } from 'map/mapViewportActions.js';
import { mapHover, mapClick, clearPopup } from 'map/mapInteractionActions.js';
import Map from './Map.jsx';

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
