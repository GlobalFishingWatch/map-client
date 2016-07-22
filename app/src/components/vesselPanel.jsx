import React, {Component} from "react";
import vesselPanel from "../../styles/components/c_vessel_panel.scss";

export default function (props) {
  return (
    <div className={vesselPanel.vesselPanel}>
      Click on a vessel:
      <p>SERIES: <span id="vesselPanelSeries"></span></p>
      <p>LAT: <span id="vesselPanelLat"></span></p>
      <p>LONG: <span id="vesselPanelLong"></span></p>
      <p>WEIGHT: <span id="vesselPanelWeight"></span></p>
    </div>
  );
}
