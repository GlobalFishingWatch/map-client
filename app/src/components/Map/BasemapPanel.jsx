import React, { Component } from 'react';
import BasemapPanelStyles from '../../../styles/components/map/c-basemap-panel.scss';

class BasemapPanel extends Component {

  render() {
    return (
      <div className={BasemapPanelStyles['c-basemap-panel']}>
        <ul className={BasemapPanelStyles['basemap-list']}>
          <li className={BasemapPanelStyles['basemap-item']}>
            <img alt="bathymetry" src="#" className="basemap-img" />
            <span className={BasemapPanelStyles['basemap-title']}>bathymetry</span>
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

export default BasemapPanel;
