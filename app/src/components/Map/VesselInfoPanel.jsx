import React, { Component } from 'react';
import classnames from 'classnames';
import iso3311a2 from 'iso-3166-1-alpha-2';
import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=Icon';
import vesselPanelStyles from 'styles/components/c-vessel-info-panel.scss';
import buttonCloseStyles from 'styles/components/c-button-close.scss';
import helperStyles from 'styles/_helpers.scss';

class VesselInfoPanel extends Component {

  render() {
    let vesselInfoContents = null;
    let RFMORegistry = null;
    const visibilityClass = this.props.vesselVisibility ? null : helperStyles['_is-hidden'];
    const vesselInfo = this.props.vesselInfo;

    if (vesselInfo && vesselInfo.rfmo_registry_info) {
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

    if (vesselInfo === null || vesselInfo.isCluster || vesselInfo.isLoading) {
      let message;
      if (vesselInfo === null) {
        message = <div>There are no vessels at this location</div>;
      } else if (vesselInfo.isLoading) {
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
    } else {
      let iso = null;
      if (vesselInfo !== undefined && vesselInfo.flag) {
        iso = iso3311a2.getCountry(vesselInfo.flag);
      }

      const canSeeVesselId = (this.props.userPermissions.indexOf('info') !== -1);

      vesselInfoContents = (
        <div className={vesselPanelStyles['vessel-metadata']}>
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
      <div
        className={classnames(vesselPanelStyles['c-vessel-info-panel'], visibilityClass)}
        id="vesselBox"
      >
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
  vesselInfo: React.PropTypes.object,
  hide: React.PropTypes.func,
  zoomIntoVesselCenter: React.PropTypes.func,
  login: React.PropTypes.func,
  vesselVisibility: React.PropTypes.bool,
  userPermissions: React.PropTypes.array
};

export default VesselInfoPanel;
