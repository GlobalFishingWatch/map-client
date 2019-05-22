import { connect } from 'react-redux'
import ReportPanel from 'app/report/components/ReportPanel'
import {
  deletePolygon,
  discardReport,
  toggleSubscriptionModalVisibility,
  toggleReportPanelVisibility,
} from 'app/report/reportActions'
import { trackDiscardReport } from 'app/analytics/analyticsActions'

const mapStateToProps = (state) => ({
  polygons: state.report.polygons,
  visible: state.report.showReportPanel,
  layerTitle: state.report.layerTitle,
  status: state.report.status,
  statusText: state.report.statusText,
  reportWarning: state.literals.report_warning,
  reportableInfo: state.layers.reportableInfo,
})

const mapDispatchToProps = (dispatch) => ({
  onDiscardReport: () => {
    dispatch(discardReport())
    dispatch(trackDiscardReport())
  },
  onReportClose: () => {
    dispatch(discardReport())
  },
  onRemovePolygon: (index) => {
    dispatch(deletePolygon(index))
  },
  onSendReport: () => {
    dispatch(toggleSubscriptionModalVisibility())
    dispatch(toggleReportPanelVisibility())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportPanel)
