import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { REPORT_STATUS } from 'constants';
import ShareStyles from 'styles/components/map/share.scss';
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

  onChangeSubscriptionFrequency(event) {
    this.props.onChangeSubscriptionFrequency(event.target.value);
  }

  render() {
    if (this.props.status === REPORT_STATUS.sent || this.props.status === REPORT_STATUS.error) {
      return (
        <div className={ReportPanelStyles.polygonItem} >
          <span className={ReportPanelStyles.polygonMessage} >{this.props.statusText}</span >
          <button className={ReportPanelStyles.reportButton} onClick={this.props.onSubscriptionDone} >close</button >
        </div >
      );
    }

    const subscriptionOptions = SUBSCRIBE_SETTINGS.map(option => (
      <option key={option.name} value={option.value} >{option.name}</option >)
    );

    const layerList = [];
    this.props.polygons.map(polygon => (
      layerList.push((
        <li className={ReportPanelStyles.polygonItem} key={polygon.id} >
          <span className={ReportPanelStyles.polygonName} >{polygon.name}</span >
        </li >
      ))
    ));

    return (
      <div >
        <h2 >Subscribe</h2 >
        <span >
          You are about to subscribe to:
        </span >
        <ul className={ReportPanelStyles.polygonList} >
          {layerList}
        </ul >
        <select
          value={this.props.subscriptionFrequency}
          className={ShareStyles.shareInput}
          onChange={event => this.onChangeSubscriptionFrequency(event)}
        >
          {subscriptionOptions}
        </select >
        <button
          className={ReportPanelStyles.reportButton}
          onClick={this.props.onCloseSubscriptionModal}
        >
          Cancel
        </button >
        <button
          className={classnames(ReportPanelStyles.reportButton,
            { [ReportPanelStyles._disabled]: !this.state.enabled })}
          onClick={() => this.onSubmitSubscription()}
          disabled={!this.state.enabled}
        >
          Subscribe
        </button >
      </div >
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
