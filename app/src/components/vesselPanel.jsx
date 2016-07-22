import React, {Component} from "react";
import vesselPanel from "../../styles/components/c_vessel_panel.scss";

export default function (props) {
  return (
    <div className={vesselPanel.vesselPanel} id="vesselBox">
      Click on a vessel:
      <p>SERIES: <span id="vesselPanelSeries"></span></p>
      <p>SERIESGROUP: <span id="vesselPanelSeriesgroup"></span></p>
      <p>LAT: <span id="vesselPanelLat"></span></p>
      <p>LONG: <span id="vesselPanelLong"></span></p>
      <p>WEIGHT: <span id="vesselPanelWeight"></span></p>
      <p>CALLSIGN: <span id="vesselPanelCallsign"></span></p>
      <p>FLAG: <span id="vesselPanelFlag"></span></p>
      <p>IMO: <span id="vesselPanelImo"></span></p>
      <p>MMSI: <span id="vesselPanelMmsi"></span></p>
      <p>NAME: <span id="vesselPanelName"></span></p>
    </div>
  );
}
