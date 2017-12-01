import { connect } from 'react-redux';
import SubscriptionModal from 'report/components/SubscriptionModal';
import {
  toggleReportPanelVisibility,
  toggleSubscriptionModalVisibility,
  sendSubscription,
  updateSubscriptionFrequency,
  discardReport
} from 'report/reportActions';

const mapStateToProps = state => ({
  polygons: state.report.polygons,
  subscriptionFrequency: state.report.subscriptionFrequency,
  status: state.report.status,
  statusText: state.report.statusText
});

const mapDispatchToProps = dispatch => ({
  onChangeSubscriptionFrequency: (frequency) => {
    dispatch(updateSubscriptionFrequency(frequency));
  },
  onSubmitSubscription: () => {
    dispatch(sendSubscription());
  },
  onSubscriptionDone: () => {
    dispatch(discardReport());
    dispatch(toggleSubscriptionModalVisibility());
  },
  onCloseSubscriptionModal: () => {
    dispatch(toggleSubscriptionModalVisibility());
    dispatch(toggleReportPanelVisibility());

  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionModal);
