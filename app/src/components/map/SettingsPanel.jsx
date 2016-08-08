import React, { Component } from 'react';
import SettingsPanelStyle from '../../../styles/components/c-settings_panel.scss';

class SettingsPanel extends Component {

  render() {
    const intensities = [];

    for (let intensity = 5; intensity <= 50; intensity += 5) {
      intensities.push(<option value={intensity} key={intensity}>{intensity}</option>);
    }

    return (
      <div className={SettingsPanelStyle.settingsPanel}>
        <div>
          <label htmlFor="drawIntensity">Vessel transparency
            <select
              id="drawIntensity"
              onChange={(e) => this.props.updateVesselTransparency(e.target.value)}
              defaultValue={this.props.vesselTransparency}
            >
              {intensities}
            </select>
          </label>
        </div>
      </div>
    );
  }
}
SettingsPanel.propTypes = {
  updateVesselTransparency: React.PropTypes.func,
  vesselTransparency: React.PropTypes.number
};
export default SettingsPanel;
