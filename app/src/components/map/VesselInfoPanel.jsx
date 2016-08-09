import React, { Component } from 'react';
import vesselPanel from '../../../styles/components/c_vessel_panel.scss';
import iso3311a2 from 'iso-3166-1-alpha-2';

class VesselInfoPanel extends Component {

  render() {
    if (!this.props.vesselInfoDetails || !Object.keys(this.props.vesselInfoDetails).length) {
      return null;
    }

    let marineTrafficLink = (
      <a
        href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${this.props.vesselInfoDetails.mmsi}`}
        target="_blank"
      >
        here
      </a>);

    let flag = '';
    if (this.props.vesselInfoDetails.flag) {
      flag = iso3311a2.getCountry(this.props.vesselInfoDetails.flag);
    }

    let extraInfo = [];
    if (this.props.vesselInfoDetails.latitude && this.props.vesselInfoDetails.longitude) {
      extraInfo.push(
        <p key="vesselPanelLat">Lat:<span id="vesselPanelLat">{this.props.vesselInfoDetails.latitude}</span></p>
      );
      extraInfo.push(
        <p key="vesselPanelLong">Long: <span id="vesselPanelLong">{this.props.vesselInfoDetails.longitude}</span></p>
      );
    }
    if (this.props.vesselInfoDetails.timestamp) {
      let humanDate = new Date(this.props.vesselInfoDetails.timestamp).toISOString().slice(0, 10);
      extraInfo.push(
        <p key="vesselPanelDate">Date: <span id="vesselPanelDate">{humanDate}</span></p>
      );
    }

    return (
      <div className={vesselPanel.vesselPanel} id="vesselBox">
        <h3>Vessel information:</h3>
        {extraInfo}
        <p>Callsign: <span id="vesselPanelCallsign">{this.props.vesselInfoDetails.callsign}</span></p>
        <p>Flag: <span id="vesselPanelFlag">{flag}</span></p>
        <p>IMO: <span id="vesselPanelImo">{this.props.vesselInfoDetails.imo}</span></p>
        <p>MMSI: <span id="vesselPanelMmsi">{this.props.vesselInfoDetails.mmsi}</span></p>
        <p>Name: <span id="vesselPanelName">{this.props.vesselInfoDetails.vesselname}</span></p>
        <p>More info: <span id="vesselPanelMarineTraffic">{marineTrafficLink}</span></p>
      </div>
    );
  }
}

VesselInfoPanel.propTypes = {
  vesselInfoDetails: React.PropTypes.object
};

export default VesselInfoPanel;
