import { connect } from 'react-redux';
import PolygonLayerPopup from 'map/components/PolygonLayerPopup.jsx';

const mapStateToProps = state => ({
  popup: state.mapInteraction.popup
});

const mapDispatchToProps = dispatch => ({
  // setViewport: (viewport) => {
  //   dispatch(setViewport(viewport));
  // },

});

export default connect(mapStateToProps, mapDispatchToProps)(PolygonLayerPopup);
