import { connect } from 'react-redux';
import ReportPanel from 'components/Map/ReportPanel';
import { deletePolygon } from 'actions/report';

const mapStateToProps = (state) => ({
  polygons: state.report.polygons
});

const mapDispatchToProps = (dispatch) => ({
  onDiscardReport: () => {
    // replace this with an action
    console.info('onDiscardReport');
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
