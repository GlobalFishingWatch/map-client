import React, { Component } from 'react';
import classnames from 'classnames';
import iso3311a2 from 'iso-3166-1-alpha-2';
import { RadioGroup, Radio } from 'react-radio-group';

import vesselPanelStyles from '../../../styles/components/c-vessel-info-panel.scss';

class VesselInfoPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      vesselInfo: this.props.vesselInfo,
      vesselVisibility: this.props.vesselVisibility
    };
  }

  componentDidMount() {
    this.setVars();
  }

  componentWillReceiveProps(nextProps) {
    // new vessel selected
    if (this.state.vesselInfo.callsign !== nextProps.vesselInfo.callsign) {
      if (nextProps.vesselPosition) {
        this.setVesselPosition(nextProps.vesselPosition);
      }
    }

    this.setState(nextProps);
  }

  setVars() {
    this.el = document.querySelector('#vesselBox');
  }

  setVesselPosition(position) {
    const top = position.top;
    const left = position.left;

    this.el.setAttribute('style', `top: ${top + 30}px; left: ${left - 25}px`);
  }

  render() {
    const visibilityClass = this.state.vesselVisibility ? '' : vesselPanelStyles['-hidden'];
    let vesselInfo = null;

    if (this.props.vesselInfo && Object.keys(this.props.vesselInfo).length) {
      let iso = null;
      if (this.props.vesselInfo.flag) {
        iso = iso3311a2.getCountry(this.props.vesselInfo.flag);
      }

      // const extraInfo = [];
      // if (this.props.vesselInfo.latitude && this.props.vesselInfo.longitude) {
      //   extraInfo.push(
      //     <p key="vesselPanelLat">Lat:<span id="vesselPanelLat">{this.props.vesselInfo.latitude}</span></p>
      //   );
      //   extraInfo.push(
      //     <p key="vesselPanelLong">Long: <span id="vesselPanelLong">{this.props.vesselInfo.longitude}</span></p>
      //   );
      // }
      // if (this.props.vesselInfo.timestamp) {
      //   const humanDate = new Date(this.props.vesselInfo.timestamp).toISOString().slice(0, 10);
      //   extraInfo.push(
      //     <p key="vesselPanelDate">Date: <span id="vesselPanelDate">{humanDate}</span></p>
      //   );
      // }

      vesselInfo = (
        <div>
          <div className={vesselPanelStyles['vessel-metadata']}>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Name</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.vesselname}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>IMO</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.imo}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Class</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.shiptype_text || '---'}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>MMSI</span>
              <span className={vesselPanelStyles.value}>{this.props.vesselInfo.mmsi}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Country</span>
              <span className={vesselPanelStyles.value}>{iso}</span>
            </div>
            <div className={vesselPanelStyles['row-info']}>
              <span className={vesselPanelStyles.key}>Callsign</span>
              <span className={vesselPanelStyles.key}>{this.props.vesselInfo.callsign}</span>
            </div>
          </div>

          <div className={vesselPanelStyles['vessel-track-mode']}>
            <RadioGroup
              name="vesselTrackDisplayStatus"
              selectedValue={this.props.vesselTrackDisplayMode}
              onChange={() => this.changeVesselTrackDisplayMode}
              className={vesselPanelStyles.trackMode}
            >
              <Radio
                name="vessel-track-mode"
                id="vessel-track-model-all"
                className={vesselPanelStyles.radio}
                value="all"
              />
              <label htmlFor="vessel-track-model-all" className={vesselPanelStyles['track-mode']}>
                <span className={vesselPanelStyles.circle}></span>
                View all journeys
              </label>
              <Radio
                name="vessel-track-mode"
                id="vessel-track-model-single"
                className={vesselPanelStyles.radio} value="single"
              />
              <label htmlFor="vessel-track-model-single" className={vesselPanelStyles['track-mode']}>
                <span className={vesselPanelStyles.circle}></span>
                View single journey
              </label>
            </RadioGroup>
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
  changeVesselTrackDisplayMode: React.PropTypes.func,
  vesselInfo: React.PropTypes.object,
  vesselTrackDisplayMode: React.PropTypes.string,
  vesselPosition: React.PropTypes.object,
  vesselVisibility: React.PropTypes.bool
};

export default VesselInfoPanel;
