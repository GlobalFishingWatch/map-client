import { connect } from 'react-redux';
import PolygonLayerPopup from 'map/components/PolygonLayerPopup.jsx';
import { toggleCurrentReportPolygon } from 'report/reportActions';
import { clearPopup } from 'map/mapInteractionActions';

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

export default connect(mapStateToProps, mapDispatchToProps)(PolygonLayerPopup);
