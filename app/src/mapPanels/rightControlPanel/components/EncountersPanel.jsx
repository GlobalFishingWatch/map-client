import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import ExpandButton from 'components/Shared/ExpandButton';
import Tab from 'sharedUI/components/Tab';
import infoPanelStyles from 'styles/components/info-panel.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';

import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';

import { INFO_STATUS } from 'constants';

class EncountersPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true,
      tabIndex: 0
    };
    this.handleTabIndexChange = this.handleTabIndexChange.bind(this);
  }

  onExpand() {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  componentDidMount() {
    this.props.setEncountersInfo(); // Only until we have real API data
  }

  handleTabIndexChange(tabIndex) {
    this.setState({ tabIndex });
  }

  renderVessel(vessel) {
    return (
      <div className={infoPanelStyles.encountersData} >
        <div className={infoPanelStyles.rowInfo} >
          <span className={infoPanelStyles.key} >Date</span>
          <span className={infoPanelStyles.value} >{vessel.date}</span>
        </div>
        <div className={infoPanelStyles.rowInfo} >
          <span className={infoPanelStyles.key} >MMSI</span>
          <span className={infoPanelStyles.value} >{vessel.MMSI}</span>
        </div>
        <div className={infoPanelStyles.rowInfo} >
          <span className={infoPanelStyles.key} >Vessel</span>
          <span className={infoPanelStyles.value} >Link to vessel</span>
        </div>
      </div>
    );
  }

  renderEncounterInfo() {
    const encountersInfo = this.props.encountersInfo;
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
            <span className={infoPanelStyles.oval} />
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
        {this.state.tabIndex === 0 ?
          this.renderVessel(encounterVessel) :
          this.renderVessel(reeferVessel)
        }
      </div>
    );
  }

  renderEncountersInfoContainer() {
    const { encountersInfo, infoPanelStatus } = this.props;
    if (infoPanelStatus === INFO_STATUS.LOADING) {
      return (
        <div className={infoPanelStyles.metadata} >
          <div>Loading encounters information...</div>
        </div>
      );
    } else if (infoPanelStatus === INFO_STATUS.LOADED && encountersInfo) {
      return (
        <div className={classnames(infoPanelStyles.metadata, infoPanelStyles._noPadding)} >
          {this.renderEncounterInfo()}
        </div>
      );
    }
    return null;
  }

  render() {
    const { encountersInfo, infoPanelStatus } = this.props;

    if (infoPanelStatus !== INFO_STATUS.LOADING && encountersInfo === null) {
      return null;
    }

    return (
      <div
        className={classnames(infoPanelStyles.infoPanel,
          { [`${infoPanelStyles._expanded}`]: this.state.isExpanded })}
      >
        <div className={infoPanelStyles.buttonsContainer} >
          <MediaQuery maxWidth={789} >
            <ExpandButton
              onExpand={() => this.onExpand()}
              isExpanded={this.state.isExpanded}
            />
          </MediaQuery>

          <button
            onClick={() => this.props.hide()}
            className={classnames(buttonCloseStyles.buttonClose, infoPanelStyles.closeBtn)}
          >
            <CloseIcon className={buttonCloseStyles.cross} />
          </button>
        </div>
        {this.renderEncountersInfoContainer()}
      </div>);
  }
}

EncountersPanel.propTypes = {
  encountersInfo: PropTypes.object,
  infoPanelStatus: PropTypes.number,
  setEncountersInfo: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired
};

export default EncountersPanel;
