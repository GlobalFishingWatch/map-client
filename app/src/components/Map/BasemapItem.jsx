import React, { Component } from 'react';
import classnames from 'classnames';
import LayerListStyles from '../../../styles/components/map/c-layer-list.scss';
import layerPanelStyle from '../../../styles/components/map/c-layer-panel.scss';
import SwitcherStyles from '../../../styles/components/shared/c-switcher.scss';
import iconsStyles from '../../../styles/icons.scss';

class BasemapItem extends Component {

  openModal() {
    console.info('opens modal');
  }

  render() {
    const itemArray = [];
    const activeClass = this.props.isActive ? LayerListStyles['-open'] : null;

    this.props.layers.forEach((layer, index) => {
      const baseMapItem = (
        <li
          className={LayerListStyles['layer-item']}
          key={index}
        >
          <label>
            <input
              className={SwitcherStyles['c-switcher']}
              type="checkbox"
              checked={layer.visible}
              onChange={() => this.props.toggleLayerVisibility(layer)}
              style={{
                color: layer.color
              }}
            />
            <span className={LayerListStyles['layer-title']}>
              {layer.title}
            </span>
          </label>
          <ul className={layerPanelStyle['layer-option-list']}>
            <li
              className={layerPanelStyle['layer-option-item']}
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
      <ul
        className={classnames(LayerListStyles['sublayer-list'], activeClass)}
      >
        {itemArray}
      </ul>
    );
  }
}

BasemapItem.propTypes = {
  layers: React.PropTypes.array,
  isActive: React.PropTypes.bool,
  toggleLayerVisibility: React.PropTypes.func
};

export default BasemapItem;
