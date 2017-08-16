import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { getCountry } from 'iso-3166-1-alpha-2';
import MediaQuery from 'react-responsive';
import ExpandButton from 'components/Shared/ExpandButton';

import vesselPanelStyles from 'styles/components/vessel-info-panel.scss';
import buttonCloseStyles from 'styles/components/button-close.scss';
import iconStyles from 'styles/icons.scss';

import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=Icon';
import PinIcon from 'babel!svg-react!assets/icons/pin-icon.svg?name=PinIcon';

import { VESSEL_INFO_STATUS } from 'constants';

class VesselInfoPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true // expanded by default to hide the fact that accordion will remain opened.
      // TODO: close the accordion when the info panel appears.
      // TODO: replace accordion component
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

    if (status !== VESSEL_INFO_STATUS.LOADING && vesselInfo === null) {
      return null;
    }

    let vesselInfoContents = null;

    if (status === VESSEL_INFO_STATUS.LOADING) {
      vesselInfoContents = (
        <div className={vesselPanelStyles.vesselMetadata} >
          <div>Loading vessel information...</div>
        </div>
      );
    } else if (this.props.userPermissions !== null && this.props.userPermissions.indexOf('seeVesselBasicInfo') === -1) {
      return null;
    } else if (status === VESSEL_INFO_STATUS.LOADED && vesselInfo) {
      const layerFields = this.props.layerFieldsHeaders;

      const canSeeVesselDetails = (this.props.userPermissions !== null && this.props.userPermissions.indexOf('info') !== -1);

      const renderedFieldList = this.generateVesselDetails(layerFields, canSeeVesselDetails, vesselInfo);

      vesselInfoContents = (
        <div className={vesselPanelStyles.vesselMetadata} >
          {((this.props.userPermissions !== null && this.props.userPermissions.indexOf('pin-vessel') !== -1) || vesselInfo.pinned) &&
          <PinIcon
            className={classnames(iconStyles.icon, iconStyles.pinIcon,
              vesselPanelStyles.pin, { [`${vesselPanelStyles._pinned}`]: vesselInfo.pinned })}
            onClick={() => {
              this.props.onTogglePin(vesselInfo.seriesgroup);
            }}
          />}
          {renderedFieldList}
          {canSeeVesselDetails && vesselInfo.mmsi && <a
            className={vesselPanelStyles.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${vesselInfo.mmsi}`}
          >Check it out on MarineTraffic.com
          </a>
          }
          {!canSeeVesselDetails && <a
            className={vesselPanelStyles.externalLink}
            onClick={this.props.login}
          >Click here to login and see more details</a>
          }
        </div>
      );
    }

    return (
      <div
        className={classnames(vesselPanelStyles.vesselInfoPanel,
          { [`${vesselPanelStyles._expanded}`]: this.state.isExpanded })}
      >
        <div className={vesselPanelStyles.buttonsContainer} >

          <MediaQuery maxWidth={789} >
            <ExpandButton
              onExpand={() => this.onExpand()}
              isExpanded={this.state.isExpanded}
            />
          </MediaQuery>

          <button
            onClick={() => this.props.hide()}
            className={classnames(buttonCloseStyles.buttonClose, vesselPanelStyles.closeBtn)}
          >
            <CloseIcon className={buttonCloseStyles.cross} />
          </button>
        </div>
        {vesselInfoContents}
      </div>);
  }

  generateVesselDetails(layerFields, canSeeVesselDetails, vesselInfo) {
    const renderedFieldList = [];

    layerFields.filter(field => field.display !== false && (canSeeVesselDetails || field.anonymous)).forEach((field) => {
      let linkList;
      if (vesselInfo[field.id] === undefined) {
        return;
      }
      switch (field.kind) {
        case 'prefixedCSVMultiLink':
          if (!vesselInfo[field.id]) {
            break;
          }
          renderedFieldList.push(<div key={field.id} className={vesselPanelStyles.rowInfo} >
            <span className={vesselPanelStyles.key} >{field.display}</span>
            <ul className={vesselPanelStyles.linkList} >
              <li className={vesselPanelStyles.linkListItem} >
                <a
                  className={vesselPanelStyles.externalLink}
                  href={`${field.prefix}${vesselInfo[field.id]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {vesselInfo[field.id]}
                </a>
              </li>
            </ul>
          </div>);
          break;
        case 'objectArrayMultiLink':
          linkList = [];
          vesselInfo[field.id].forEach((registry) => {
            linkList.push(<li key={registry.rfmo} className={vesselPanelStyles.linkListItem} >
              <a
                className={vesselPanelStyles.externalLink}
                href={`${registry.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {registry.rfmo}
              </a>
            </li>);
          });
          renderedFieldList.push(<div key={field.id} className={vesselPanelStyles.rowInfo} >
            <span className={vesselPanelStyles.key} >{field.display}</span>
            <ul className={vesselPanelStyles.linkList} >
              {linkList}
            </ul>
          </div>);
          break;
        case 'flag':
          renderedFieldList.push(<div key={field.id} className={vesselPanelStyles.rowInfo} >
            <span className={vesselPanelStyles.key} >{field.display}</span>
            <span className={vesselPanelStyles.value} >{getCountry(vesselInfo[field.id]) || '---'}</span>
          </div>);
          break;
        default:
          renderedFieldList.push(<div key={field.id} className={vesselPanelStyles.rowInfo} >
            <span className={vesselPanelStyles.key} >{field.display}</span>
            <span className={vesselPanelStyles.value} >{vesselInfo[field.id] || '---'}</span>
          </div>);
      }
    });

    return renderedFieldList;
  }
}

VesselInfoPanel.propTypes = {
  layerFieldsHeaders: PropTypes.array,
  currentlyShownVessel: PropTypes.object,
  infoPanelStatus: PropTypes.number,
  userPermissions: PropTypes.array,
  hide: PropTypes.func,
  onTogglePin: PropTypes.func,
  login: PropTypes.func
};

export default VesselInfoPanel;
