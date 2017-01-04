import { connect } from 'react-redux';
import ReportPanel from 'components/Map/ReportPanel';
import { deletePolygon, discardReport } from 'actions/report';

const mapStateToProps = (state) => ({
  polygons: state.report.polygons
});

const mapDispatchToProps = (dispatch) => ({
  onDiscardReport: () => {
    dispatch(discardReport());
  },
  onRemovePolygon: (index) => {
    dispatch(deletePolygon(index));
  },
  onSendReport: () => {
    // replace this with an action
    console.info('onSendReport');
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportPanel);
