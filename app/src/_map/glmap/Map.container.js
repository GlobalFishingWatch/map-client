import { connect } from 'react-redux';
// TODO MAP MODULE
import { mapHover, mapClick /*, clearPopup*/ } from './interaction.actions.js';
import { setViewport, setMouseLatLong, transitionEnd } from './viewport.actions.js';
import Map from './Map.jsx';

const mapStateToProps = state => ({
  viewport: state.map.viewport.viewport,
  maxZoom: state.map.viewport.maxZoom,
  minZoom: state.map.viewport.minZoom,
  mapStyle: state.map.style.mapStyle,
  // popup: state.mapInteraction.popup, 
  // hoverPopup: state.map.Interaction.hoverPopup,
  cursor: state.map.interaction.cursor
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
  // clearPopup: () => {
  //   dispatch(clearPopup());
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
