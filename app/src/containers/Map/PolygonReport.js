import { connect } from 'react-redux';
import PolygonReport from 'components/Map/PolygonReport';
import { toggleReportPolygon, hidePolygonModal } from 'report/reportActions';

const mapStateToProps = state => ({
  id: state.report.currentPolygon.id,
  name: state.report.currentPolygon.name,
  latLng: state.report.currentPolygon.latLng,
  isInReport: state.report.currentPolygon.isInReport
});

const mapDispatchToProps = dispatch => ({
  toggleReportPolygon: (polygonId) => {
    dispatch(toggleReportPolygon(polygonId));
  },
  hidePolygonModal: () => {
    dispatch(hidePolygonModal());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PolygonReport);
