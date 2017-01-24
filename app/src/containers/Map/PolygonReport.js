import { connect } from 'react-redux';
import PolygonReport from 'components/Map/PolygonReport';
import { toggleReportPolygon, clearPolygon } from 'actions/report';

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
  clearPolygon: () => {
    dispatch(clearPolygon());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PolygonReport);
