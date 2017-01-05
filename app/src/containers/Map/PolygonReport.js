import { connect } from 'react-redux';
import PolygonReport from 'components/Map/PolygonReport';
import { toggleReportPolygon } from 'actions/report';

const mapStateToProps = (state) => ({
  reportLayerId: state.report.layerId
});

const mapDispatchToProps = (dispatch) => ({
  toggleReportPolygon: polygonId => {
    dispatch(toggleReportPolygon(polygonId, `name TBD (${polygonId})`));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PolygonReport);
