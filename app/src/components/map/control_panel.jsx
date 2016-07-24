import React, {Component} from "react";
import controlPanel from "../../../styles/components/c_control_panel.scss";
import {TIMELINE_STEP} from "../../constants";

export default function (props) {
  let options = [];
  let maxLength = ~~((props.endDate - props.startDate) / TIMELINE_STEP);

  for (let length = 1; length < Math.min(maxLength, 30); length += 1) {
    options.push(<option value={length} key={length}>{length}</option>)
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
        <label for="drawIntensity">Vessel intensity
          <input id="drawIntensity" type="range" onChange={(e) => props.onDrawDensityChange(e.target.value)} min="1"
                 max="10" defaultValue={10}/>
        </label>
      </div>
    </div>
  );
}
