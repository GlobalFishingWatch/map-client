import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import ExpandButton from 'components/Shared/ExpandButton';

import infoPanelStyles from 'styles/components/info-panel.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';
// import iconStyles from 'styles/icons.scss';

import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';

import { INFO_STATUS } from 'constants';

class EncountersPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true
    };
  }

  onExpand() {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  componentDidMount() {
    this.props.setEncountersInfo(); // Only until we have real API data
  }

  renderEncounterInfo() {
    const encountersInfo = this.props.encountersInfo;
    const vesselsList = encountersInfo.vessels.map(vessel => (
      <div key={vessel.tilesetId} className={infoPanelStyles.rowInfo} >
        <span className={infoPanelStyles.key} >{vessel.vesselTypeName}</span>
        <ul className={infoPanelStyles.linkList} >
          {vessel.tilesetId}
        </ul>
      </div>
    ));

    return (
      <div className={infoPanelStyles.rowInfo} >
        <ul className={infoPanelStyles.linkList} >
          <li className={infoPanelStyles.linkListItem} >
            <a
              className={infoPanelStyles.externalLink}
              href={`${encountersInfo.duration}${encountersInfo.duration}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {encountersInfo.duration}
            </a>
          </li>
        </ul>
        { vesselsList }
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
        <div className={infoPanelStyles.metadata} >
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
