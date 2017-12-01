import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { REPORT_STATUS } from 'constants';
import Select from 'react-select';
import SelectorStyles from 'styles/components/shared/react-select.scss';
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
    if (this.props.status === REPORT_STATUS.sent || this.props.status === REPORT_STATUS.error) {
      return (
        <div className={ReportPanelStyles.polygonItem} >
          <span className={ReportPanelStyles.polygonMessage} >{this.props.statusText}</span >
          <button className={ReportPanelStyles.reportButton} onClick={this.props.onSubscriptionDone} >close</button >
        </div >
      );
    }

    const subscriptionOptions = SUBSCRIBE_SETTINGS.map(option => (
      {
        label: option.name,
        value: option.value
      }
    ));

    const layerList = [];
    this.props.polygons.map(polygon => (
      layerList.push((
        <li className={ReportPanelStyles.polygonItem} key={polygon.id} >
          <span className={ReportPanelStyles.polygonName} >{polygon.name}</span >
        </li >
      ))
    ));

    return (
      <div className={ReportPanelStyles.subscriptionModal}>
        <h3 className={ReportPanelStyles.subscriptionTitle}>Subscribe</h3>
        <div className={ReportPanelStyles.subscriptionInfo}>
          <span >
            You are about to subscribe to:
          </span >
          <ul
            className={classnames(
              ReportPanelStyles.polygonList,
              ReportPanelStyles.polygonName
            )}
          >
            {layerList}
          </ul >
        </div>
        <div
          className={classnames(
            SelectorStyles.select,
            SelectContainerStyles.selectContainer,
            SelectContainerStyles.fixedWidth,
            ReportPanelStyles.selector
          )}
        >
          <Select
            value={this.props.subscriptionFrequency}
            options={subscriptionOptions}
            onChange={option => this.onChangeSubscriptionFrequency(option)}
            clearable={false}
            searchable={false}
          />
        </div>
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
            Subscribe
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
