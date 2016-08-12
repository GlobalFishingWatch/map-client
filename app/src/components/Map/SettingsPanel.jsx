import React, { Component } from 'react';
import SettingsPanelStyle from '../../../styles/components/c-settings_panel.scss';

class SettingsPanel extends Component {

  render() {
    const intensities = [];

    for (let intensity = 10; intensity >= 0; intensity --) {
      intensities.push(<option value={intensity} key={intensity}>{intensity * 10}%</option>);
    }

    return (
      <div className={SettingsPanelStyle.settingsPanel}>
        <div>
          <label htmlFor="drawIntensity">Vessel opacity
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
