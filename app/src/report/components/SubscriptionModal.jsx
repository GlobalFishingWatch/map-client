import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { REPORT_STATUS } from 'constants';
import SelectorStyles from 'styles/components/shared/selector.scss';
import SelectContainerStyles from 'styles/components/shared/select-container.scss';
import ButtonStyles from 'styles/components/button.scss';
import ReportPanelStyles from 'styles/components/map/report-panel.scss';
import { SUBSCRIBE_SETTINGS } from 'config';
import classnames from 'classnames';

class SubscriptionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true
    };
  }

  onSubmitSubscription() {
    this.setState({
      enabled: false
    });
    this.props.onSubmitSubscription();
  }

  onChangeSubscriptionFrequency(option) {
    this.props.onChangeSubscriptionFrequency(option.value);
  }

  render() {
    const { status, statusText, onSubscriptionDone } = this.props;
    if (status === REPORT_STATUS.sent || status === REPORT_STATUS.error) {
      return (
        <div className={ReportPanelStyles.subscriptionModal} >
          <div className={ReportPanelStyles.subscriptionInfo} >
            {statusText}
          </div >
          <div
            className={classnames(
              ReportPanelStyles.buttonContainer,
              ReportPanelStyles.singleButton
            )}
          >
            <button
              className={classnames(
                ButtonStyles.button,
                ButtonStyles._big,
                ButtonStyles._noBorderRadius,
                ButtonStyles._transparent,
                ReportPanelStyles.button
              )}
              onClick={onSubscriptionDone}
            >
              Close
            </button >
          </div >
        </div >
      );
    }

    const subscriptionOptions = SUBSCRIBE_SETTINGS.map(option => (
      <option key={option.name} value={option.value} > {option.name}</option >)
    );

    const layerList = [];
    this.props.polygons.map(polygon => (
      layerList.push((
        <li key={polygon.id} >
          <span>{polygon.name}</span >
        </li >
      ))
    ));

    return (
      <div className={ReportPanelStyles.subscriptionModal}>
        <h3 className={ReportPanelStyles.subscriptionTitle}>Report</h3>
        <div className={ReportPanelStyles.subscriptionInfo}>
          <div className={ReportPanelStyles.subscriptionTitle} >
            You are about to request a report for:
          </div >
          <ul
            className={classnames(
              ReportPanelStyles.polygonList,
              ReportPanelStyles.modalPolygonName
            )}
          >
            {layerList}
          </ul >
        </div>
        {USE_SUBSCRIPTIONS &&
          <div
            className={classnames(
              SelectorStyles.selector,
              SelectorStyles._big,
              SelectContainerStyles.selectContainer,
              SelectContainerStyles.fixedWidth
            )}
          >
            <select
              onChange={e => this.onChangeSubscriptionFrequency(e.target)}
              value={this.props.subscriptionFrequency}
            >
              {subscriptionOptions}
            </select >
          </div >
        }
        <div className={classnames(ReportPanelStyles.buttonContainer)}>
          <button
            className={classnames(
              ButtonStyles.button,
              ButtonStyles._big,
              ButtonStyles._noBorderRadius,
              ButtonStyles._transparent,
              ReportPanelStyles.button
            )}
            onClick={this.props.onCloseSubscriptionModal}
            disabled={!this.state.enabled}
          >
            Cancel
          </button >
          <button
            className={classnames(
              ButtonStyles.button,
              ButtonStyles._big,
              ButtonStyles._noBorderRadius,
              ReportPanelStyles.button,
              ButtonStyles._filled,
              { [ButtonStyles._disabled]: !this.state.enabled })
            }
            onClick={() => this.onSubmitSubscription()}
            disabled={!this.state.enabled}
          >
            Yes, submit
          </button >
        </div>
      </div>
    );
  }
}

SubscriptionModal.defaultProps = {
  polygons: []
};

SubscriptionModal.propTypes = {
  onSubmitSubscription: PropTypes.func,
  onCloseSubscriptionModal: PropTypes.func,
  onChangeSubscriptionFrequency: PropTypes.func,
  onSubscriptionDone: PropTypes.func,
  status: PropTypes.string,
  statusText: PropTypes.string,
  subscriptionFrequency: PropTypes.string,
  polygons: PropTypes.array
};

export default SubscriptionModal;
