import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Tab from 'sharedUI/components/Tab';
import infoPanelStyles from 'styles/components/info-panel.scss';

import EncountersVessel from './EncountersVessel';

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
    const encounterVessel = encountersInfo.vessels.find(vessel => vessel.vesselTypeName === 'ENCOUNTER_BOAT');
    const reeferVessel = encountersInfo.vessels.find(vessel => vessel.vesselTypeName !== 'ENCOUNTER_BOAT');

    const tabOptions = [
      <div className={infoPanelStyles.vesselHeader}>
        Vessel
      </div>,
      <div className={infoPanelStyles.reeferHeader}>
        Reefer
      </div>];

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
          <div className={infoPanelStyles.duration} >
            <span className={infoPanelStyles.durationLabel} >
              Duration
            </span>
            {encountersInfo.duration}
          </div>
        </div>
        <Tab
          options={tabOptions}
          style={infoPanelStyles.tab}
          selectedIndex={this.state.tabIndex}
          handleTabIndexChange={this.handleTabIndexChange}
        />
        <EncountersVessel vessel={this.state.tabIndex === 0 ? encounterVessel : reeferVessel} />
      </div>
    );
  }
}

EncountersInfo.propTypes = {
  encountersInfo: PropTypes.object.isRequired
};

export default EncountersInfo;
