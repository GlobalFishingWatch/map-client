import React, { Component } from 'react';
import SettingsPanelStyle from '../../../styles/components/c-settings_panel.scss';
import { DEFAULT_VESSEL_COLOR } from '../../constants';

class SettingsPanel extends Component {

  render() {
    const colors = [
      DEFAULT_VESSEL_COLOR,
      '#FFC861',
      '#FFD485',
      '#e8f4f9',
      '#ef4323'
    ];
    const colorOptions = [];
    for (let colorIndex = 0; colorIndex <= colors.length; colorIndex += 1) {
      colorOptions.push(<option value={colors[colorIndex]} key={colorIndex}>{colors[colorIndex]}</option>);
    }
    const intensities = [];
    for (let intensity = 10; intensity >= 0; intensity --) {
      intensities.push(<option value={intensity} key={intensity}>{intensity * 10}%</option>);
    }

    return (
      <div className={SettingsPanelStyle.settingsPanel}>
        <div>
          <label htmlFor="vesselTransparency">Vessel opacity
            <select
              id="vesselTransparency"
              onChange={(e) => this.props.updateVesselTransparency(e.target.value)}
              defaultValue={this.props.vesselTransparency}
            >
              {intensities}
            </select>
          </label>
          <label htmlFor="vesselColor">Vessel color
            <select
              id="vesselColor"
              onChange={(e) => this.props.updateVesselColor(e.target.value)}
              defaultValue={DEFAULT_VESSEL_COLOR}
            >
              {colorOptions}
            </select>
          </label>
        </div>
      </div>
    );
  }
}

SettingsPanel.propTypes = {
  updateVesselTransparency: React.PropTypes.func,
  vesselTransparency: React.PropTypes.number,
  updateVesselColor: React.PropTypes.func,
  vesselColor: React.PropTypes.string
};

export default SettingsPanel;
