import React, { Component } from 'react';
import classnames from 'classnames';
import LayerListStyles from '../../../styles/components/map/c-layer-list.scss';
import iconsStyles from '../../../styles/icons.scss';
// import bathymetryThumbnail from '../../../assets/images/basemaps/bathymetry.png';
// import satelliteThumbnail from '../../../assets/images/basemaps/satellite.png';

class BasemapPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      basemap: 'Deep Blue'
    };
  }

  onClickInfo() {
    console.info('opens modal');
  }

  onSelectBasemap(event, layer) {
    const basemap = event.currentTarget.getAttribute('data-basemap');

    if (this.state.basemap === basemap) return;

    Object.assign(this.state, {
      basemap
    });

    this.setState(this.state);

    this.props.toggleLayerVisibility(layer);
  }

  render() {
    const items = [];
    if (!this.props.layers) return null;

    this.props.layers.forEach((layer, i) => {
      const urlThumbnail = `/basemaps/${layer.thumbnail}.png`;
      const itemLayer = (
        <li
          className={classnames(LayerListStyles['layer-item'],
            this.state.basemap === layer.title ? LayerListStyles['-selected'] : null)}
          data-basemap={layer.title}
          key={i}
          onClick={(event) => this.onSelectBasemap(event, layer)}
        >
          <div className={LayerListStyles['layer-info']}>
            <img alt={layer.title} src={urlThumbnail} className={LayerListStyles['layer-thumbnail']} />
            <span className={LayerListStyles['layer-title']}>{layer.title}</span>
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
  layers: React.PropTypes.array,
  subLayers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func
};

export default BasemapPanel;
