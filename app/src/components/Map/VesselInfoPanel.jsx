import React, { Component } from 'react';
import classnames from 'classnames';
import iso3311a2 from 'iso-3166-1-alpha-2';
import MediaQuery from 'react-responsive';
import ExpandButton from 'components/Shared/ExpandButton';

import vesselPanelStyles from 'styles/components/c-vessel-info-panel.scss';
import buttonCloseStyles from 'styles/components/c-button-close.scss';
import iconStyles from 'styles/icons.scss';

import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=Icon';
import PinIcon from 'babel!svg-react!assets/icons/pin-icon.svg?name=PinIcon';

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
    const vesselInfo = this.props.vessels.find(vessel => vessel.shownInInfoPanel === true);
    const status = this.props.infoPanelStatus;

    if (status === null && vesselInfo === undefined) {
      return null;
    }

    let vesselInfoContents = null;

    if (status.isLoading) {
      vesselInfoContents = (
        <div className={vesselPanelStyles['vessel-metadata']}>
          <div>Loading vessel information...</div>
        </div>
      );
    } else if (this.props.userPermissions !== null && this.props.userPermissions.indexOf('seeVesselBasicInfo') === -1) {
      return null;
    } else if (vesselInfo !== undefined) {
      let iso = null;
      if (vesselInfo.flag) {
        iso = iso3311a2.getCountry(vesselInfo.flag);
      }

      let RFMORegistry = null;
      if (vesselInfo.rfmo_registry_info) {
        RFMORegistry = [];
        vesselInfo.rfmo_registry_info.forEach((registry) => {
          RFMORegistry.push(<li key={registry.rfmo} className={vesselPanelStyles['rfmo-item']}>
            <a
              className={vesselPanelStyles['external-link']}
              href={`${registry.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {registry.rfmo}
            </a>
          </li>);
        });
      }

      const canSeeVesselId = (this.props.userPermissions !== null && this.props.userPermissions.indexOf('info') !== -1);

      vesselInfoContents = (
        <div className={vesselPanelStyles['vessel-metadata']}>
          {((this.props.userPermissions !== null && this.props.userPermissions.indexOf('pin-vessel') !== -1) || vesselInfo.pinned) &&
          <PinIcon
            className={classnames(iconStyles.icon, iconStyles['pin-icon'],
              vesselPanelStyles.pin, { [`${vesselPanelStyles['-pinned']}`]: vesselInfo.pinned })}
            onClick={() => { this.props.onTogglePin(vesselInfo.seriesgroup); }}
          />}
          {canSeeVesselId && <div className={vesselPanelStyles['row-info']}>
            <span className={vesselPanelStyles.key}>Name</span>
            <span className={vesselPanelStyles.value}>{vesselInfo.vesselname || '---'}</span>
          </div>
          }
          {canSeeVesselId && <div className={vesselPanelStyles['row-info']}>
            <span className={vesselPanelStyles.key}>IMO</span>
            <span className={vesselPanelStyles.value}>{vesselInfo.imo || '---'}</span>
          </div>
          }
          <div className={vesselPanelStyles['row-info']}>
            <span className={vesselPanelStyles.key}>Class</span>
            <span className={vesselPanelStyles.value}>{vesselInfo.shiptype_text || '---'}</span>
          </div>
          {canSeeVesselId && <div className={vesselPanelStyles['row-info']}>
            <span className={vesselPanelStyles.key}>MMSI</span>
            <span className={vesselPanelStyles.value}>{vesselInfo.mmsi || '---'}</span>
          </div>
          }
          <div className={vesselPanelStyles['row-info']}>
            <span className={vesselPanelStyles.key}>Country</span>
            <span className={vesselPanelStyles.value}>{iso || '---'}</span>
          </div>
          {canSeeVesselId && <div className={vesselPanelStyles['row-info']}>
            <span className={vesselPanelStyles.key}>Callsign</span>
            <span className={vesselPanelStyles.value}>{vesselInfo.callsign || '---'}</span>
          </div>
          }
          {canSeeVesselId && RFMORegistry && <div className={vesselPanelStyles['row-info']}>
            <span className={vesselPanelStyles.key}>RFMO</span>
            <ul className={vesselPanelStyles['rfmo-list']}>
              {RFMORegistry}
            </ul>
          </div>
          }
          {canSeeVesselId && vesselInfo.mmsi && <a
            className={vesselPanelStyles['external-link']}
            target="_blank"
            rel="noopener noreferrer"
            href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${vesselInfo.mmsi}`}
          >Check it out on MarineTraffic.com
          </a>
          }
          {!canSeeVesselId && <a
            className={vesselPanelStyles['external-link']}
            onClick={this.props.login}
          >Click here to login and see more details</a>
          }
        </div>
      );
    }

    return (
      <div
        className={classnames(vesselPanelStyles['c-vessel-info-panel'],
          { [`${vesselPanelStyles['-expanded']}`]: this.state.isExpanded })}
      >
        <div className={vesselPanelStyles['buttons-container']}>

          <MediaQuery maxWidth={789}>
            <ExpandButton
              onExpand={() => this.onExpand()}
              isExpanded={this.state.isExpanded}
            />
          </MediaQuery>

          <button
            onClick={() => this.props.hide()}
            className={classnames(buttonCloseStyles['c-button-close'], vesselPanelStyles['close-btn'])}
          >
            <CloseIcon className={buttonCloseStyles.cross} />
          </button>
        </div>
        {vesselInfoContents}
      </div>);
  }
}

VesselInfoPanel.propTypes = {
  vessels: React.PropTypes.array,
  infoPanelStatus: React.PropTypes.object,
  userPermissions: React.PropTypes.array,
  hide: React.PropTypes.func,
  onTogglePin: React.PropTypes.func,
  login: React.PropTypes.func
};

export default VesselInfoPanel;
