import React, {Component} from "react";
import controlPanel from "../../../styles/components/c_control_panel.scss";
import {TIMELINE_STEP} from "../../constants";

export default function (props) {
  let options = [], intensities = [];
  let maxLength = ~~((props.endDate - props.startDate) / TIMELINE_STEP);

  for (let length = 1; length < Math.min(maxLength, 90); length += 1) {
    options.push(<option value={length} key={length}>{length}</option>)
  }

  for (let intensity = 5; intensity <= 50; intensity += 5) {
    intensities.push(<option value={intensity} key={intensity}>{intensity}</option>)
  }

  return (
    <div className={controlPanel.controlPanel}>
      <div>
        <label for="timeStep">Playback range
          <select id="timeStep" onChange={(e) => props.onTimeStepChange(e.target.value)} defaultValue={1}>
            {options}
          </select>
        </label>
      </div>

      <div>
        <label for="drawIntensity">Vessel transparency
          <select id="drawIntensity" onChange={(e) => props.onDrawDensityChange(e.target.value)} defaultValue={9}>
            {intensities}
          </select>
        </label>
      </div>
    </div>
  );
}
