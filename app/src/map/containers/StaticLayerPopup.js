import { connect } from 'react-redux';
import StaticLayerPopup from 'map/components/StaticLayerPopup.jsx';
import { toggleCurrentReportPolygon } from 'report/reportActions';

const mapStateToProps = state => ({
  popup: state.mapInteraction.popup
});

const mapDispatchToProps = dispatch => ({
  toggleCurrentReportPolygon: () => {
    dispatch(toggleCurrentReportPolygon());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StaticLayerPopup);
