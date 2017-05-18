import PropTypes from 'prop-types';
import React, { Component } from 'react';
import camelCase from 'lodash/camelCase';
import classnames from 'classnames';

import LayerListStyles from 'styles/components/map/c-layer-list.scss';

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
          className={classnames(LayerListStyles['layer-item'],
            this.props.activeBasemap === basemap.title ? LayerListStyles['-selected'] : null)}
          key={basemap.title}
        >
          <div
            className={LayerListStyles['layer-info']}
            onClick={event => this.onSelectBasemap(event, basemap)}
          >
            <img alt={basemap.title} src={urlThumbnail} className={LayerListStyles['layer-thumbnail']} />
            <span className={LayerListStyles['layer-title']}>{basemap.label}</span>
          </div>
          <ul className={LayerListStyles['layer-option-list']}>
            <li
              className={LayerListStyles['layer-option-item']}
              onClick={() => this.onClickInfo(basemap)}
            >
              <InfoIcon />
            </li>
          </ul>
        </li>);

      items.push(itemLayer);
    });

    return (
      <ul className={LayerListStyles['c-layer-list']}>
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
