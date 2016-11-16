import React, { Component } from 'react';
import classnames from 'classnames';
import BasemapItem from './BasemapItem';
import LayerListStyles from '../../../styles/components/map/c-layer-list.scss';
import iconsStyles from '../../../styles/icons.scss';
import bathymetryThumbnail from '../../../assets/images/basemaps/bathymetry.png';
import satelliteThumbnail from '../../../assets/images/basemaps/satellite.png';

class BasemapPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: ''
    };
  }

  onClickInfo() {
    console.info('opens modal');
  }

  toggleSubMenu(event) {
    const target = event.currentTarget.getAttribute('data-item');

    Object.assign(this.state, {
      active: this.state.active === target ? '' : target
    });

    this.setState(this.state);
  }

  render() {
    if (!this.props.basemapLayers) return null;
    return (
      <ul className={LayerListStyles['c-layer-list']}>
        <li className={LayerListStyles['layer-item']} >
          <div
            className={LayerListStyles['layer-info']}
            data-item="bathymetry"
            onClick={(event) => this.toggleSubMenu(event)}
          >
            <img alt="bathymetry" src={bathymetryThumbnail} className={LayerListStyles['layer-thumbnail']} />
            <span className={LayerListStyles['layer-title']}>bathymetry</span>
          </div>
          <ul className={LayerListStyles['layer-option-list']}>
            <li
              className={LayerListStyles['layer-option-item']}
              onClick={this.onClickInfo}
            >
              <svg className={classnames(iconsStyles.icon, iconsStyles['icon-i-icon'])}>
                <use xlinkHref="#icon-i-icon"></use>
              </svg>
            </li>
          </ul>
          {this.props.basemapLayers.length &&
            <BasemapItem
              basemapLayers={this.props.basemapLayers}
              toggleLayerVisibility={this.props.toggleLayerVisibility}
              isActive={this.state.active === 'bathymetry'}
            />
          }
        </li>
        <li className={LayerListStyles['layer-item']}>
          <div className={LayerListStyles['layer-info']}>
            <img alt="satellite" src={satelliteThumbnail} className={LayerListStyles['layer-thumbnail']} />
            <span className={LayerListStyles['layer-title']}>satellite</span>
          </div>
        </li>
      </ul>
    );
  }
}

BasemapPanel.propTypes = {
  basemapLayers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func
};

export default BasemapPanel;
