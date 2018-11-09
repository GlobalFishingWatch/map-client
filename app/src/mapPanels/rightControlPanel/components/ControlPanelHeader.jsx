import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import ControlPanelStyles from 'styles/components/control_panel.scss';
import IconStyles from 'styles/icons.scss';
import InfoIcon from '-!babel-loader!svg-react-loader!assets/icons/info.svg?name=InfoIcon';
import MiniGlobe from 'map/containers/MiniGlobe';

class ControlPanelHeader extends Component {
  calculateFishingHours() {
    const min = this.props.timelineInnerExtent[0].getTime();
    const max = this.props.timelineInnerExtent[1].getTime();

    if (this.props.chartData.length === 0) {
      return '-';
    }

    const result = this.props.chartData.reduce((acc, elem) => {
      if (elem.date >= min && elem.date <= max) {
        return acc + elem.value;
      }
      return acc;
    }, 0);

    return Math.round(result).toLocaleString();
  }

  render() {
    return (
      <div className={ControlPanelStyles.resumeDisplay}>
        <div className={ControlPanelStyles.categoriesDisplay}>
          <MiniGlobe />
          <div className={ControlPanelStyles.vesselDisplay}>
            <span className={ControlPanelStyles.counterDescription}>
              Vessels activity
              <InfoIcon
                className={classnames(ControlPanelStyles.fishingHours, IconStyles.infoIcon, IconStyles.small)}
                onClick={() => this.props.openTimebarInfoModal()}
              />
            </span>
            <span className={ControlPanelStyles.total} >{this.calculateFishingHours()}</span>
          </div>
        </div>
      </div>
    );
  }
}

ControlPanelHeader.propTypes = {
  chartData: PropTypes.array,
  openTimebarInfoModal: PropTypes.func,
  timelineInnerExtent: PropTypes.array
};

export default ControlPanelHeader;
