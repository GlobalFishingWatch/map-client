import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import ExpandButton from 'components/Shared/ExpandButton';

import infoPanelStyles from 'styles/components/info-panel.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';
import iconStyles from 'styles/icons.scss';

import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=Icon';
import PinIcon from '-!babel-loader!svg-react-loader!assets/icons/pin.svg?name=PinIcon';

import { INFO_STATUS } from 'constants';

import VesselInfoDetails from './VesselInfoDetails';


class VesselInfoPanel extends Component {

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

  render() {
    const vesselInfo = this.props.currentlyShownVessel;
    const status = this.props.infoPanelStatus;

    if (status !== INFO_STATUS.LOADING && vesselInfo === null) {
      return null;
    }

    let vesselInfoContents = null;

    if (status === INFO_STATUS.LOADING) {
      vesselInfoContents = (
        <div className={infoPanelStyles.metadata} >
          <div>Loading vessel information...</div>
        </div>
      );
    } else if (this.props.userPermissions !== null && this.props.userPermissions.indexOf('seeVesselBasicInfo') === -1) {
      return null;
    } else if (status === INFO_STATUS.LOADED && vesselInfo) {
      const canSeeVesselDetails = (this.props.userPermissions !== null && this.props.userPermissions.indexOf('info') !== -1);

      vesselInfoContents = (
        <div className={infoPanelStyles.metadata} >
          <VesselInfoDetails {...this.props} />
          {((
            this.props.userPermissions !== null &&
            this.props.userPermissions.indexOf('pin-vessel') !== -1 &&
            this.props.layerIsPinable
          ) || vesselInfo.pinned)
          &&
            <PinIcon
              className={classnames(iconStyles.icon, iconStyles.pinIcon,
                infoPanelStyles.pinIcon, { [`${infoPanelStyles._pinned}`]: vesselInfo.pinned })}
              onClick={() => {
                this.props.onTogglePin(vesselInfo.seriesgroup);
              }}
            />
          }
          {canSeeVesselDetails && vesselInfo.mmsi && <a
            className={infoPanelStyles.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${vesselInfo.mmsi}`}
          >Check it out on MarineTraffic.com
          </a>
          }
          {!canSeeVesselDetails && <a
            className={infoPanelStyles.externalLink}
            onClick={this.props.login}
          >Click here to login and see more details</a>
          }
          {vesselInfo.parentEncounter !== null && <button
            className={classnames(infoPanelStyles.backButton)}
            onClick={() => { this.props.showParentEncounter(vesselInfo.parentEncounter); }}
          >
            <span className={infoPanelStyles.backIcon} />
            <span className={infoPanelStyles.backText}>
              back to encounter event
            </span>
            <span className={infoPanelStyles.ovalContainer} >
              <span className={infoPanelStyles.oval} />
            </span>
          </button>
          }
        </div>
      );
    }

    return (
      <div
        className={classnames(infoPanelStyles.infoPanel,
          { [`${infoPanelStyles._expanded}`]: this.state.isExpanded })}
      >
        <div className={infoPanelStyles.buttonsContainer} >
          <MediaQuery maxWidth={768} >
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
        {vesselInfoContents}
      </div>);
  }
}

VesselInfoPanel.propTypes = {
  currentlyShownVessel: PropTypes.object,
  layerFieldsHeaders: PropTypes.array,
  layerIsPinable: PropTypes.bool,
  infoPanelStatus: PropTypes.number,
  userPermissions: PropTypes.array,
  hide: PropTypes.func,
  onTogglePin: PropTypes.func,
  login: PropTypes.func,
  showParentEncounter: PropTypes.func
};

export default VesselInfoPanel;
