import { connect } from 'react-redux';
import StaticLayerPopup from 'map/components/StaticLayerPopup.jsx';
import { toggleCurrentReportPolygon } from 'report/reportActions';
import { clearPopup } from 'map/mapInteractionActions.js';

const mapStateToProps = state => ({
  popup: state.mapInteraction.popup
});

const mapDispatchToProps = dispatch => ({
  toggleCurrentReportPolygon: () => {
    dispatch(toggleCurrentReportPolygon());
  },
  clearPopup: () => {
    dispatch(clearPopup());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StaticLayerPopup);
