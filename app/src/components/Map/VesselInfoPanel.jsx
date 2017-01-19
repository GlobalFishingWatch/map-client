import React, { Component } from 'react';
import classnames from 'classnames';
import iso3311a2 from 'iso-3166-1-alpha-2';

import vesselPanelStyles from 'styles/components/c-vessel-info-panel.scss';
import buttonCloseStyles from 'styles/components/c-button-close.scss';
import iconStyles from 'styles/icons.scss';

import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=Icon';
import PinIcon from 'babel!svg-react!assets/icons/pin-icon.svg?name=PinIcon';

class VesselInfoPanel extends Component {

  render() {
    const vesselInfo = this.props.details.find(vessel => vessel.visible === true);
    const status = this.props.detailsStatus;

    if (status === null || vesselInfo === undefined) {
      return null;
    }

    let vesselInfoContents = null;

    if (status.isEmpty || status.isCluster || status.isLoading) {
      let message;
      if (status.isEmpty) {
        message = <div>There are no vessels at this location</div>;
      } else if (status.isLoading) {
        message = <div>Loading vessel information...</div>;
      } else {
        message = (
          <div>
            There are multiple vessels at this location.
            <a onClick={() => this.props.zoomIntoVesselCenter()} className={vesselPanelStyles.zoom}>
              Zoom in to see individual points.
            </a>
          </div>
        );
      }
      vesselInfoContents = (
        <div className={vesselPanelStyles['vessel-metadata']}>
          {message}
        </div>
      );
    } else if (this.props.userPermissions.indexOf('seeVesselBasicInfo') === -1) {
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
          RFMORegistry.push(<li className={vesselPanelStyles['rfmo-item']}>
            <a
              className={vesselPanelStyles['external-link']}
              href={`${registry.url}`}
              target="_blank"
            >
              {registry.rfmo}
            </a>
          </li>);
        });
      }

      const canSeeVesselId = (this.props.userPermissions.indexOf('info') !== -1);

      vesselInfoContents = (
        <div className={vesselPanelStyles['vessel-metadata']}>
          <PinIcon
            className={classnames(iconStyles.icon, iconStyles['pin-icon'],
              vesselPanelStyles.pin, { [`${vesselPanelStyles['-pinned']}`]: vesselInfo.pinned })}
            onClick={() => { this.props.togglePin(); }}
          />
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
            href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${vesselInfo.mmsi}`}
          >Check it on MarineTraffic.com
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
      <div className={vesselPanelStyles['c-vessel-info-panel']} >
        <div>
          <span
            onClick={() => this.props.hide()}
            className={buttonCloseStyles['c-button-close']}
          >
            <CloseIcon className={buttonCloseStyles.cross} />
          </span>
          {vesselInfoContents}
        </div>
      </div>);
  }
}

VesselInfoPanel.propTypes = {
  details: React.PropTypes.array,
  detailsStatus: React.PropTypes.object,
  userPermissions: React.PropTypes.array,
  hide: React.PropTypes.func,
  zoomIntoVesselCenter: React.PropTypes.func,
  togglePin: React.PropTypes.func,
  login: React.PropTypes.func
};

export default VesselInfoPanel;
