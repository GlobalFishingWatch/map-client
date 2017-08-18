import PropTypes from 'prop-types';
import React, { Component } from 'react';
import camelCase from 'lodash/camelCase';
import classnames from 'classnames';
import LayerListStyles from 'styles/components/map/layer-list.scss';

class BasemapPanel extends Component {

  onSelectBasemap(event, basemap) {
    this.props.setBasemap(basemap.title);
  }

  render() {
    const items = [];

    this.props.basemaps.forEach((basemap) => {
      const imageName = camelCase(basemap.title);
      const urlThumbnail = `${PUBLIC_PATH}basemaps/${imageName}.png`;
      const itemLayer = (
        <li
          className={classnames(LayerListStyles.layerItem, LayerListStyles.halfRow,
            this.props.activeBasemap === basemap.title ? LayerListStyles._selected : null)}
          key={basemap.title}
        >
          <div
            className={LayerListStyles.layerInfo}
            onClick={event => this.onSelectBasemap(event, basemap)}
          >
            <img alt={basemap.title} src={urlThumbnail} className={LayerListStyles.layerThumbnail} />
            <span className={LayerListStyles.layerTitle} >{basemap.label}</span >
          </div >
        </li >);

      items.push(itemLayer);
    });

    return (
      <div className={LayerListStyles.basemapsPanel} >
        <div className={LayerListStyles.title} > Basemaps</div >
        <ul className={LayerListStyles.layerList} >
          {items}
        </ul >
      </div >
    );
  }
}

BasemapPanel.propTypes = {
  basemaps: PropTypes.array,
  activeBasemap: PropTypes.string,
  setBasemap: PropTypes.func
};

export default BasemapPanel;
