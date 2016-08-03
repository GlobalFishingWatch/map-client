import React, { Component } from 'react';
import ControlPanelStyle from '../../../styles/components/c_control_panel.scss';
import { TIMELINE_STEP } from '../../constants';

class ControlPanel extends Component {

  render() {
    const options = [];
    const intensities = [];
    const maxLength = ~~((this.props.endDate - this.props.startDate) / TIMELINE_STEP);

    for (let length = 1; length < Math.min(maxLength, 20); length += 1) {
      options.push(<option value={length} key={length}>{length}</option>);
    }

    for (let intensity = 5; intensity <= 50; intensity += 5) {
      intensities.push(<option value={intensity} key={intensity}>{intensity}</option>);
    }

    return (
      <div className={ControlPanelStyle.controlPanel}>
        <div>
          <label htmlFor="timeStep">Playback range
            <select id="timeStep" onChange={(e) => this.props.onTimeStepChange(e.target.value)} defaultValue={1}>
              {options}
            </select>
          </label>
        </div>

        <div>
          <label htmlFor="drawIntensity">Vessel transparency
            <select
              id="drawIntensity"
              onChange={(e) => this.props.onDrawDensityChange(e.target.value)}
              defaultValue={9}
            >
              {intensities}
            </select>
          </label>
        </div>
      </div>
    );
  }
}
ControlPanel.propTypes = {
  startDate: React.PropTypes.number,
  endDate: React.PropTypes.number,
  onDrawDensityChange: React.PropTypes.func,
  onTimeStepChange: React.PropTypes.func
};
export default ControlPanel;
