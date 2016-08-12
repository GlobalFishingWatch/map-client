import React, { Component } from 'react';
import SettingsPanelStyle from '../../../styles/components/c-settings_panel.scss';
import { DEFAULT_VESSEL_COLOR } from '../../constants';

class SettingsPanel extends Component {

  render() {
    const colors = [
      DEFAULT_VESSEL_COLOR,
      '#e41ccc',
      '#fe5f07',
      '#a73c8a',
      '#9e7854',
      '#61c200',
      '#c7ad23'
    ];
    const colorOptions = [];
    for (let colorIndex = 0; colorIndex <= colors.length; colorIndex += 1) {
      colorOptions.push(<option value={colors[colorIndex]} key={colorIndex}>{colors[colorIndex]}</option>);
    }
    const intensities = [];
    for (let intensity = 5; intensity <= 50; intensity += 5) {
      intensities.push(<option value={intensity} key={intensity}>{intensity}</option>);
    }

    return (
      <div className={SettingsPanelStyle.settingsPanel}>
        <div>
          <label htmlFor="vesselTransparency">Vessel transparency
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
