import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import ListItemStyles from 'styles/components/map/item-list.scss';
import BasemapStyles from 'styles/rightControlPanel/basemap-panel.scss';
import ExpandItemButton from 'components/Shared/ExpandItemButton';
import Labels from '-!babel-loader!svg-react-loader!assets/icons/labels.svg';
import Graticules from '-!babel-loader!svg-react-loader!assets/icons/graticules.svg';
import Bathymetry from '-!babel-loader!svg-react-loader!assets/icons/bathymetry.svg';

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
      let icon;
      switch (basemapOption.id) {
        case 'labels' : icon = <Labels />; break;
        case 'graticules' : icon = <Graticules />; break;
        case 'bathymetry' : icon = <Bathymetry />; break;
        default : icon = null; break;
      }
      const basemapOptionButton = (
        <div
          key={basemapOption.id}
          onClick={() => this.props.toggleBasemapOption(basemapOption.id)}
          className={BasemapStyles.option}
        >
          <ExpandItemButton
            active={basemapOption.visible}
            expandable={false}
            label={basemapOption.label || basemapOption.id}
          >
            {icon}
          </ExpandItemButton >
        </div>
      );
      basemapOptionsButtons.push(basemapOptionButton);
    });

    return (
      <div className={BasemapStyles.basemapsPanel} >
        <ul className={ListItemStyles.list} >
          {basemapButtons}
        </ul >
        <ul className={BasemapStyles.options} >
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
