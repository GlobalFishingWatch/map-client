import { connect } from 'react-redux';
import PolygonReport from 'components/Map/PolygonReport';
import { toggleReportPolygon } from 'actions/report';

const mapDispatchToProps = (dispatch) => ({
  toggleReportPolygon: polygonId => {
    dispatch(toggleReportPolygon(polygonId, `name TBD (${polygonId})`));
  }
});

export default connect(null, mapDispatchToProps)(PolygonReport);
