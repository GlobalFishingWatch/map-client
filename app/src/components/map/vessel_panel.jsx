import React, {Component} from "react";
import vesselPanel from "../../../styles/components/c_vessel_panel.scss";

export default function (props) {
  return (
    <div className={vesselPanel.vesselPanel} id="vesselBox">
      Vessel information:
      <p>Series: <span id="vesselPanelSeries"></span></p>
      <p>Series Group: <span id="vesselPanelSeriesgroup"></span></p>
      <p>Lat: <span id="vesselPanelLat"></span></p>
      <p>Long: <span id="vesselPanelLong"></span></p>
      <p>Weight: <span id="vesselPanelWeight"></span></p>
      <p>Callsign: <span id="vesselPanelCallsign"></span></p>
      <p>Flag: <span id="vesselPanelFlag"></span></p>
      <p>IMO: <span id="vesselPanelImo"></span></p>
      <p>MMSI: <span id="vesselPanelMmsi"></span></p>
      <p>Name: <span id="vesselPanelName"></span></p>
      <p>More info: <span id="vesselPanelMarineTraffic"></span></p>
    </div>
  );
}
