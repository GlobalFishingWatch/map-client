import React, { Component } from 'react';
import classnames from 'classnames';
import BasemapPanelStyles from '../../../styles/components/map/c-basemap-panel.scss';
import layerPanelStyle from '../../../styles/components/map/c-layer-panel.scss';
import iconsStyles from '../../../styles/icons.scss';

class BasemapItem extends Component {

  openModal() {
    console.info('opens modal');
  }

  render() {
    const itemArray = [];

    this.props.basemapLayers.forEach((basemapLayer, index) => {
      const baseMapItem = (
        <li
          className={BasemapPanelStyles['basemap-layers-item']}
          key={index}
        >
          <label>
            <input
              className={layerPanelStyle.switcher}
              type="checkbox"
              checked={basemapLayer.visible}
              onChange={() => this.props.toggleLayerVisibility(basemapLayer)}
              style={{
                color: basemapLayer.color
              }}
            />
            <span className={BasemapPanelStyles['basemap-layer-name']}>
              {basemapLayer.title}
            </span>
          </label>
          <ul className={layerPanelStyle['layer-options-list']}>
            <li
              className={layerPanelStyle['layer-options-item']}
              onClick={this.openModal}
            >
              <svg className={classnames(iconsStyles.icon, iconsStyles['icon-i-icon'])}>
                <use xlinkHref="#icon-i-icon"></use>
              </svg>
            </li>
          </ul>
        </li>
      );

      itemArray.push(baseMapItem);
    });

    return (
      <ul className={BasemapPanelStyles['sublist-basemap-layers']}>
        {itemArray}
      </ul>
    );
  }
}

BasemapItem.propTypes = {
  basemapLayers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func
};

export default BasemapItem;
