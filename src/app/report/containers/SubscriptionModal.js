import { connect } from 'react-redux'
import SubscriptionModal from 'app/report/components/SubscriptionModal'
import {
  toggleReportPanelVisibility,
  toggleSubscriptionModalVisibility,
  sendSubscription,
  updateSubscriptionFrequency,
  discardReport,
} from 'app/report/reportActions'

const mapStateToProps = (state) => ({
  polygons: state.report.polygons,
  subscriptionFrequency: state.report.subscriptionFrequency,
  status: state.report.status,
  statusText: state.report.statusText,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeSubscriptionFrequency: (frequency) => {
    dispatch(updateSubscriptionFrequency(frequency))
  },
  onSubmitSubscription: () => {
    dispatch(sendSubscription())
  },
  onSubscriptionDone: () => {
    dispatch(toggleSubscriptionModalVisibility())
    dispatch(discardReport())
  },
  onCloseSubscriptionModal: () => {
    dispatch(toggleSubscriptionModalVisibility())
    dispatch(toggleReportPanelVisibility())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionModal)
