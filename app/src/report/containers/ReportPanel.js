import { connect } from 'react-redux';
import ReportPanel from 'report/components/ReportPanel';
import {
  deletePolygon,
  discardReport,
  sendReport,
  toggleSubscriptionModalVisibility,
  toggleReportPanelVisibility
} from 'report/reportActions';
import { trackDiscardReport } from 'analytics/analyticsActions';

const mapStateToProps = state => ({
  polygons: state.report.polygons,
  visible: state.report.showReportPanel,
  layerTitle: state.report.layerTitle,
  status: state.report.status,
  statusText: state.report.statusText,
  reportWarning: state.literals.report_warning,
  reportableInfo: state.layers.reportableInfo
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
    if (USE_SUBSCRIPTIONS) {
      dispatch(toggleSubscriptionModalVisibility());
      dispatch(toggleReportPanelVisibility());
    } else {
      dispatch(sendReport());
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportPanel);
