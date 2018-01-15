import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import Tab from 'sharedUI/components/Tab';
import infoPanelStyles from 'styles/components/info-panel.scss';
import { VESSEL_TYPE_REEFER } from 'constants';

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
            <span className={infoPanelStyles.value} >{moment(encountersInfo.datetime).format('MMM Do YYYY')}</span>
          </div>
          <div className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >Duration</span>
            <span className={infoPanelStyles.value} >{moment.duration(encountersInfo.duration).humanize()}</span>
          </div>
          <div className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >Median distance (km)</span>
            <span className={infoPanelStyles.value} >{encountersInfo.median_distance_km.toFixed(3)}</span>
          </div>
          <div className={infoPanelStyles.rowInfo} >
            <span className={infoPanelStyles.key} >Median speed (knots)</span>
            <span className={infoPanelStyles.value} >{encountersInfo.median_speed_knots.toFixed(3)}</span>
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
