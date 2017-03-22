import { connect } from 'react-redux';
import ReportPanel from 'components/Map/ReportPanel';
import { deletePolygon, discardReport, sendReport } from 'actions/report';
import { trackDiscardReport } from '../../actions/analytics';

const mapStateToProps = state => ({
  polygons: state.report.polygons,
  visible: state.report.layerId !== null,
  layerTitle: state.report.layerTitle,
  status: state.report.status,
  statusText: state.report.statusText
});

const mapDispatchToProps = dispatch => ({
  onDiscardReport: () => {
    dispatch(discardReport());
    dispatch(trackDiscardReport());
  },
  onReportClose: () => {
    dispatch(discardReport());
  },
  onRemovePolygon: (index) => {
    dispatch(deletePolygon(index));
  },
  onSendReport: () => {
    dispatch(sendReport());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportPanel);
