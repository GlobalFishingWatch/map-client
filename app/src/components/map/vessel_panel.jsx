import React, { Component } from 'react';
import vesselPanel from '../../../styles/components/c_vessel_panel.scss';

class VesselPanel extends Component {

  render() {
    let marineTrafficLink = (
      <a
        href={`http://www.marinetraffic.com/en/ais/details/ships/mmsi:${this.props.vesselInfo.mmsi}`}
        target="_blank"
      >
        here
      </a>);

    if (!Object.keys(this.props.vesselInfo).length) {
      return null;
    }
    let humanDate = new Date(this.props.vesselInfo.timestamp).toISOString().slice(0, 10);

    return (
      <div className={vesselPanel.vesselPanel} id="vesselBox">
        <h3>Vessel information:</h3>
        <p>Date: <span id="vesselPanelDate">{humanDate}</span></p>
        <p>Series: <span id="vesselPanelSeries">{this.props.vesselInfo.series}</span></p>
        <p>Series Group: <span id="vesselPanelSeriesGroup">{this.props.vesselInfo.seriesGroup}</span></p>
        <p>Lat: <span id="vesselPanelLat">{this.props.vesselInfo.latitude}</span></p>
        <p>Long: <span id="vesselPanelLong">{this.props.vesselInfo.longitude}</span></p>
        <p>Weight: <span id="vesselPanelWeight">{this.props.vesselInfo.weight}</span></p>
        <p>Callsign: <span id="vesselPanelCallsign">{this.props.vesselInfo.callsign}</span></p>
        <p>Flag: <span id="vesselPanelFlag">{this.props.vesselInfo.flag}</span></p>
        <p>IMO: <span id="vesselPanelImo">{this.props.vesselInfo.imo}</span></p>
        <p>MMSI: <span id="vesselPanelMmsi">{this.props.vesselInfo.mmsi}</span></p>
        <p>Name: <span id="vesselPanelName">{this.props.vesselInfo.name}</span></p>
        <p>More info: <span id="vesselPanelMarineTraffic">{marineTrafficLink}</span></p>
      </div>
    );
  }
}

VesselPanel.propTypes = {
  vesselInfo: React.PropTypes.object
};

export default VesselPanel;
