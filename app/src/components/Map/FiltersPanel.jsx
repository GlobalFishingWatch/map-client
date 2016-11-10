import React, { Component } from 'react';
import FiltersPanelStyle from '../../../styles/components/c-filters-panel.scss';
import { DEFAULT_VESSEL_COLOR } from '../../constants';

class FiltersPanel extends Component {

  render() {
    const colors = [
      DEFAULT_VESSEL_COLOR,
      '#FFC861',
      '#FFD485',
      '#e8f4f9',
      '#ef4323'
    ];

    const colorOptions = [];
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      colorOptions.push(<option value={colors[colorIndex]} key={colorIndex}>{colors[colorIndex]}</option>);
    }

    const intensities = [];
    for (let intensity = 5; intensity <= 50; intensity += 5) {
      intensities.push(<option value={intensity} key={intensity}>{intensity}</option>);
    }

    return (
      <div className={FiltersPanelStyle['filters-panel']}>
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
    );
  }
}

FiltersPanel.propTypes = {
  updateVesselTransparency: React.PropTypes.func,
  vesselTransparency: React.PropTypes.number,
  updateVesselColor: React.PropTypes.func,
  vesselColor: React.PropTypes.string
};

export default FiltersPanel;
