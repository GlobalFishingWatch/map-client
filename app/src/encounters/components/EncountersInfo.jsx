import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import Tab from 'sharedUI/components/Tab';
import infoPanelStyles from 'styles/components/info-panel.scss';
import { VESSEL_TYPE_REEFER } from 'constants';
import { FORMAT_DATE, FORMAT_NUM_DECIMALS } from 'config';

import EncountersVessel from '../containers/EncountersVessel';

class EncountersInfo extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0
    };
    this.handleTabIndexChange = this.handleTabIndexChange.bind(this);
  }

  handleTabIndexChange(tabIndex) {
    this.setState({ tabIndex });
  }

  render() {
    const { encountersInfo } = this.props;

    const tabOptions = encountersInfo.vessels.map(vessel =>
      (<div
        className={(vessel.vesselTypeName === VESSEL_TYPE_REEFER)
          ? infoPanelStyles.reeferHeader
          : infoPanelStyles.vesselHeader}
      >
        {vessel.vesselTypeName}
      </div>)
    );

    const date = (encountersInfo.datetime === undefined) ? '-' : moment(encountersInfo.datetime).format(FORMAT_DATE);
    const duration = (encountersInfo.duration === undefined) ? '-' : moment.duration(encountersInfo.duration).humanize();

    return (
      <div className={infoPanelStyles.info}>
        <div className={infoPanelStyles.header} >
          <div className={infoPanelStyles.title}>
            <span className={infoPanelStyles.ovalContainer} >
              <span className={infoPanelStyles.oval} />
            </span>
            <span className={infoPanelStyles.encountersTitle} >
              ENCOUNTERS
            </span>
          </div>
        </div>
        <div className={infoPanelStyles.encountersData}>
          <div className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >Date</span>
            <span className={infoPanelStyles.value} >{date}</span>
          </div>
          <div className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >Duration</span>
            <span className={infoPanelStyles.value} >{duration}</span>
          </div>
          <div className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >Median distance (km)</span>
            <span className={infoPanelStyles.value} >{encountersInfo.median_distance_km.toFixed(FORMAT_NUM_DECIMALS.distanceKm)}</span>
          </div>
          <div className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >Median speed (knots)</span>
            <span className={infoPanelStyles.value} >{encountersInfo.median_speed_knots.toFixed(FORMAT_NUM_DECIMALS.speedKnots)}</span>
          </div>
        </div>
        <Tab
          options={tabOptions}
          style={infoPanelStyles.tab}
          selectedIndex={this.state.tabIndex}
          handleTabIndexChange={this.handleTabIndexChange}
        />
        <EncountersVessel vessel={encountersInfo.vessels[this.state.tabIndex]} />
      </div>
    );
  }
}

EncountersInfo.propTypes = {
  encountersInfo: PropTypes.object.isRequired
};

export default EncountersInfo;
