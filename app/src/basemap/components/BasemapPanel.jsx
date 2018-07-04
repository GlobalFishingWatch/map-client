import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Toggle from 'components/Shared/Toggle';
import LayerItemStyles from 'styles/components/map/layer-item.scss';
import ListItemStyles from 'styles/components/map/item-list.scss';
import BasemapStyles from 'styles/rightControlPanel/basemap-panel.scss';

class BasemapPanel extends Component {
  render() {
    const basemapButtons = [];
    const basemapOptionsButtons = [];

    const basemaps = this.props.basemapLayers.filter(l => l.isOption !== true);
    const basemapOptions = this.props.basemapLayers.filter(l => l.isOption === true);

    basemaps.forEach((basemap) => {
      const urlThumbnail = `${PUBLIC_PATH}basemaps/${basemap.id}.png`;
      const basemapButton = (
        <li
          className={classnames(ListItemStyles.listItem, ListItemStyles._noMobileRightPadding, ListItemStyles.halfRow,
            (basemap.visible === true) ? ListItemStyles._selected : null)}
          key={basemap.id}
        >
          <div
            className={ListItemStyles.itemInfo}
            onClick={() => this.props.showBasemap(basemap.id)}
          >
            <img alt={basemap.label} src={urlThumbnail} className={ListItemStyles.layerThumbnail} />
            <span className={ListItemStyles.itemTitle} >{basemap.label}</span >
          </div >
        </li >);

      basemapButtons.push(basemapButton);
    });

    basemapOptions.forEach((basemapOption) => {
      const basemapOptionButton = (
        <div className={ListItemStyles.listItemContainer} key={basemapOption.id}>
          <li
            className={classnames(ListItemStyles.listItem, ListItemStyles._fixed)}
          >
            <div className={LayerItemStyles.layerItemHeader}>
              <Toggle
                on={basemapOption.visible}
                onToggled={() => this.props.toggleBasemapOption(basemapOption.id)}
              />
              <div className={LayerItemStyles.itemName}>
                {basemapOption.label || basemapOption.id}
              </div>
            </div>
          </li>
        </div>
      );
      basemapOptionsButtons.push(basemapOptionButton);
    });

    return (
      <div className={BasemapStyles.basemapsPanel} >
        <ul className={ListItemStyles.list} >
          {basemapButtons}
        </ul >
        <ul className={classnames(ListItemStyles.list, ListItemStyles._separated)} >
          {basemapOptionsButtons}
        </ul >
      </div >
    );
  }
}

BasemapPanel.propTypes = {
  basemapLayers: PropTypes.array,
  showBasemap: PropTypes.func,
  toggleBasemapOption: PropTypes.func
};

export default BasemapPanel;
