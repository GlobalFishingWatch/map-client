import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import LayerListStyles from '../../../styles/components/map/c-layer-list.scss';
import iconsStyles from '../../../styles/icons.scss';

class BasemapPanel extends Component {

  onClickInfo() {
    console.info('opens modal');
  }

  onSelectBasemap(event, basemap) {
    const selectedBasemap = event.currentTarget.getAttribute('data-basemap');

    if (this.props.active_basemap === selectedBasemap) return;
    this.props.setBasemap(basemap);
  }

  render() {
    const items = [];

    this.props.basemaps.forEach((basemap, i) => {
      const imageName = _.camelCase(basemap.title);
      const urlThumbnail = `/basemaps/${imageName}.png`;
      const itemLayer = (
        <li
          className={classnames(LayerListStyles['layer-item'],
            this.props.active_basemap === basemap.title ? LayerListStyles['-selected'] : null)}
          data-basemap={basemap.title}
          key={i}
          onClick={(event) => this.onSelectBasemap(event, basemap)}
        >
          <div className={LayerListStyles['layer-info']}>
            <img alt={basemap.title} src={urlThumbnail} className={LayerListStyles['layer-thumbnail']} />
            <span className={LayerListStyles['layer-title']}>{basemap.title}</span>
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
  basemaps: React.PropTypes.array,
  active_basemap: React.PropTypes.string,
  setBasemap: React.PropTypes.func
};

export default BasemapPanel;
