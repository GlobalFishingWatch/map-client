import React, { Component } from 'react';
import BasemapItem from './BasemapItem';
import BasemapPanelStyles from '../../../styles/components/map/c-basemap-panel.scss';

class BasemapPanel extends Component {

  render() {
    if (!this.props.basemapLayers) return null;
    return (
      <div className={BasemapPanelStyles['c-basemap-panel']}>
        <ul className={BasemapPanelStyles['basemap-list']}>
          <li className={BasemapPanelStyles['basemap-item']}>
            <img alt="bathymetry" src="#" className="basemap-img" />
            <span className={BasemapPanelStyles['basemap-title']}>bathymetry</span>
            {this.props.basemapLayers.length &&
              <BasemapItem
                basemapLayers={this.props.basemapLayers}
                toggleLayerVisibility={this.props.toggleLayerVisibility}
              />
            }
          </li>
          <li className={BasemapPanelStyles['basemap-item']}>
            <img alt="satellite" src="#" className="basemap-img" />
            <span className={BasemapPanelStyles['basemap-title']}>satellite</span>
          </li>
        </ul>
      </div>
    );
  }
}

BasemapPanel.propTypes = {
  basemapLayers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func
};

export default BasemapPanel;
