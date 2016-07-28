import React, {Component} from "react";
import vesselPanel from "../../../styles/components/c_vessel_panel.scss";

export default function (props) {
  let marineTrafficLink = <a href={"http://www.marinetraffic.com/en/ais/details/ships/mmsi:"+props.vesselInfo.mmsi} target="_blank">here</a>

  if (!Object.keys(props.vesselInfo).length) {
    return null
  }
  let humanDate = new Date(props.vesselInfo.timestamp).toISOString().slice(0, 10);

  return (
    <div className={vesselPanel.vesselPanel} id="vesselBox">
      <h3>Vessel information:</h3>
      <p>Date: <span id="vesselPanelDate">{humanDate}</span></p>
      <p>Series: <span id="vesselPanelSeries">{props.vesselInfo.series}</span></p>
      <p>Series Group: <span id="vesselPanelSeriesGroup">{props.vesselInfo.seriesGroup}</span></p>
      <p>Lat: <span id="vesselPanelLat">{props.vesselInfo.latitude}</span></p>
      <p>Long: <span id="vesselPanelLong">{props.vesselInfo.longitude}</span></p>
      <p>Weight: <span id="vesselPanelWeight">{props.vesselInfo.weight}</span></p>
      <p>Callsign: <span id="vesselPanelCallsign">{props.vesselInfo.callsign}</span></p>
      <p>Flag: <span id="vesselPanelFlag">{props.vesselInfo.flag}</span></p>
      <p>IMO: <span id="vesselPanelImo">{props.vesselInfo.imo}</span></p>
      <p>MMSI: <span id="vesselPanelMmsi">{props.vesselInfo.mmsi}</span></p>
      <p>Name: <span id="vesselPanelName">{props.vesselInfo.name}</span></p>
      <p>More info: <span id="vesselPanelMarineTraffic">{marineTrafficLink}</span></p>
    </div>
  );
}
