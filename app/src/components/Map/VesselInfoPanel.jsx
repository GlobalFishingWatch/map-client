import React, { Component } from 'react';
import classnames from 'classnames';
import iso3311a2 from 'iso-3166-1-alpha-2';

import CloseIcon from 'babel!svg-react!../../../assets/icons/close.svg?name=Icon';

import vesselPanelStyles from 'styles/components/c-vessel-info-panel.scss';
import helperStyles from 'styles/_helpers.scss';

class VesselInfoPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      vesselVisibility: this.props.vesselVisibility
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  onClose() {
    Object.assign(this.state, {
      vesselVisibility: false
    });

    this.setState(this.state);
  }

  render() {
    let vesselInfo = null;
    let iso = null;
    const visibilityClass = this.state.vesselVisibility ? null : helperStyles['_is-hidden'];

    if (this.props.vesselInfo && Object.keys(this.props.vesselInfo).length) {
      if (this.props.vesselInfo.flag) {
        iso = iso3311a2.getCountry(this.props.vesselInfo.flag);
      }

      vesselInfo = (
        <div>
          <span
            onClick={() => this.onClose()}
            className={vesselPanelStyles['button-close']}
          >
            <CloseIcon className={vesselPanelStyles.cross} />
          </span>
          <div className={vesselPanelStyles['vessel-metadata']}>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Name</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.vesselname || '---'}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>IMO</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.imo || '---'}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Class</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.shiptype_text || '---'}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>MMSI</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.mmsi || '---'}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Country</span>
              <span className={vesselPanelStyles.value}>{iso || '---'}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Callsign</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.callsign || '---'}</span>
            </div>
            {this.props.vesselInfo.mmsi &&
              <a
                className={vesselPanelStyles['external-link']}
                target="_blank"
                href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${this.props.vesselInfo.mmsi}`}
              >Check it on MarineTraffic.com
              </a>
            }
          </div>
        </div>
    );
    }

    return (
      <div
        className={classnames(vesselPanelStyles['c-vessel-info-panel'], visibilityClass)}
        id="vesselBox"
      >
      {vesselInfo}
      </div>);
  }
}

VesselInfoPanel.propTypes = {
  vesselInfo: React.PropTypes.object,
  vesselVisibility: React.PropTypes.bool
};

export default VesselInfoPanel;
