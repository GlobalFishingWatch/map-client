import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import LayerListStyles from 'styles/components/map/item-list.scss';
import BasemapStyles from 'styles/rightControlPanel/basemap-panel.scss';

class BasemapPanel extends Component {
  render() {
    const items = [];

    const basemaps = this.props.basemapLayers.filter(l => l.isOption !== true);
    // const basemapOptions = this.props.basemapLayers.filter(l => l.isOption === true);

    basemaps.forEach((basemap) => {
      const urlThumbnail = `${PUBLIC_PATH}basemaps/${basemap.id}.png`;
      const itemLayer = (
        <li
          className={classnames(LayerListStyles.listItem, LayerListStyles._noMobileRightPadding, LayerListStyles.halfRow,
            (basemap.visible === true) ? LayerListStyles._selected : null)}
          key={basemap.id}
        >
          <div
            className={LayerListStyles.itemInfo}
            onClick={() => this.props.setBasemap(basemap.id)}
          >
            <img alt={basemap.label} src={urlThumbnail} className={LayerListStyles.layerThumbnail} />
            <span className={LayerListStyles.itemTitle} >{basemap.label}</span >
          </div >
        </li >);

      items.push(itemLayer);
    });

    return (
      <div className={BasemapStyles.basemapsPanel} >
        <ul className={LayerListStyles.list} >
          {items}
        </ul >
      </div >
    );
  }
}

BasemapPanel.propTypes = {
  basemapLayers: PropTypes.array,
  setBasemap: PropTypes.func
};

export default BasemapPanel;
