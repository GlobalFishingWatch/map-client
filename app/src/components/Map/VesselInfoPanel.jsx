import React, { Component } from 'react';
import vesselPanel from '../../../styles/components/c-vessel-panel.scss';
import iso3311a2 from 'iso-3166-1-alpha-2';
import { RadioGroup, Radio } from 'react-radio-group';

class VesselInfoPanel extends Component {

  constructor(props) {
    super(props);
    this.changeVesselTrackDisplayMode = this.props.changeVesselTrackDisplayMode.bind(this);
  }

  render() {
    if (!this.props.vesselInfo || !Object.keys(this.props.vesselInfo).length) {
      return null;
    }

    let marineTrafficLink = (
      <a
        href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${this.props.vesselInfo.mmsi}`}
        target="_blank"
      >
        here
      </a>);

    let flag = '';
    if (this.props.vesselInfo.flag) {
      flag = iso3311a2.getCountry(this.props.vesselInfo.flag);
    }

    let extraInfo = [];
    if (this.props.vesselInfo.latitude && this.props.vesselInfo.longitude) {
      extraInfo.push(
        <p key="vesselPanelLat">Lat:<span id="vesselPanelLat">{this.props.vesselInfo.latitude}</span></p>
      );
      extraInfo.push(
        <p key="vesselPanelLong">Long: <span id="vesselPanelLong">{this.props.vesselInfo.longitude}</span></p>
      );
    }
    if (this.props.vesselInfo.timestamp) {
      let humanDate = new Date(this.props.vesselInfo.timestamp).toISOString().slice(0, 10);
      extraInfo.push(
        <p key="vesselPanelDate">Date: <span id="vesselPanelDate">{humanDate}</span></p>
      );
    }

    return (
      <div className={vesselPanel.vesselPanel} id="vesselBox">
        <h3>Vessel information:</h3>
        {extraInfo}
        <p>Callsign: <span id="vesselPanelCallsign">{this.props.vesselInfo.callsign}</span></p>
        <p>Flag: <span id="vesselPanelFlag">{flag}</span></p>
        <p>IMO: <span id="vesselPanelImo">{this.props.vesselInfo.imo}</span></p>
        <p>MMSI: <span id="vesselPanelMmsi">{this.props.vesselInfo.mmsi}</span></p>
        <p>Name: <span id="vesselPanelName">{this.props.vesselInfo.vesselname}</span></p>
        <p>More info: <span id="vesselPanelMarineTraffic">{marineTrafficLink}</span></p>
        <RadioGroup
          name="vesselTrackDisplayStatus"
          selectedValue={this.props.vesselTrackDisplayMode}
          onChange={this.changeVesselTrackDisplayMode}
        >
          <Radio value="current" />Current time scope
          <Radio value="full" />Full track
          <Radio value="all" />All tracks
        </RadioGroup>
      </div>
    );
  }
}

VesselInfoPanel.propTypes = {
  vesselInfo: React.PropTypes.object,
  changeVesselTrackDisplayMode: React.PropTypes.func,
  vesselTrackDisplayMode: React.PropTypes.string
};

export default VesselInfoPanel;
