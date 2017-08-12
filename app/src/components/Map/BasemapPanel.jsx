import PropTypes from 'prop-types';
import React, { Component } from 'react';
import camelCase from 'lodash/camelCase';
import classnames from 'classnames';

import LayerListStyles from 'styles/components/map/layer-list.scss';

import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';

class BasemapPanel extends Component {

  onClickInfo(basemap) {
    const modalParams = {
      open: true,
      info: basemap
    };

    this.props.openLayerInfoModal(modalParams);
  }

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
          className={classnames(LayerListStyles.layerItem,
            this.props.activeBasemap === basemap.title ? LayerListStyles._selected : null)}
          key={basemap.title}
        >
          <div
            className={LayerListStyles.layerInfo}
            onClick={event => this.onSelectBasemap(event, basemap)}
          >
            <img alt={basemap.title} src={urlThumbnail} className={LayerListStyles.layerThumbnail} />
            <span className={LayerListStyles.layerTitle}>{basemap.label}</span>
          </div>
          <ul className={LayerListStyles.layerOptionList}>
            <li
              className={LayerListStyles.layerOptionItem}
              onClick={() => this.onClickInfo(basemap)}
            >
              <InfoIcon />
            </li>
          </ul>
        </li>);

      items.push(itemLayer);
    });

    return (
      <ul className={LayerListStyles.layerList}>
        {items}
      </ul>
    );
  }
}

BasemapPanel.propTypes = {
  basemaps: PropTypes.array,
  activeBasemap: PropTypes.string,
  openLayerInfoModal: PropTypes.func,
  setBasemap: PropTypes.func
};

export default BasemapPanel;
