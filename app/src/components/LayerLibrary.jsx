import React, { Component } from 'react';

import LayerLibraryStyles from 'styles/components/map/c-layer-management.scss';
import LayerListStyles from 'styles/components/map/c-layer-list.scss';
import SwitcherStyles from 'styles/components/shared/c-switcher.scss';

import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';

class LayerLibrary extends Component {

  onChange(layer) {
    if (layer.added) {
      this.props.removeLayer(layer.id);
    } else {
      this.props.addLayer(layer.id);
    }
  }

  onClickInfo(layer) {
    const modalParams = {
      open: true,
      info: layer
    };

    this.props.setLayerInfoModal(modalParams);
  }

  render() {
    if (!this.props.layers) return null;

    const library = [];

    if (this.props.layers.length > 0) {
      this.props.layers.forEach((layer, i) => {
        library.push(<li
          className={LayerListStyles['layer-item']}
          key={i}
        >
          <label>
            <input
              className={SwitcherStyles['c-switcher']}
              type="checkbox"
              checked={layer.added}
              onChange={() => this.onChange(layer)}
            />
            <span className={LayerListStyles['layer-title']}>
              {layer.title}
            </span>
          </label>
          <ul className={LayerListStyles['layer-option-list']}>
            <li
              className={LayerListStyles['layer-option-item']}
              onClick={() => this.onClickInfo(layer)}
            >
              <InfoIcon />
            </li>
          </ul>
        </li>);
      });
    }

    return (
      <div className={LayerLibraryStyles['c-layer-library']}>
        {library &&
          <ul className={LayerListStyles['c-layer-list']}>
            {library}
          </ul>}
      </div>
    );
  }
}

LayerLibrary.propTypes = {
  // array of layers available in the library
  layers: React.PropTypes.array,
  // triggers when user adds a layer
  addLayer: React.PropTypes.func,
  // triggers when user removes a layer
  removeLayer: React.PropTypes.func,
  // sets modal with info about the current layer
  setLayerInfoModal: React.PropTypes.func,
  // function to set visibility of the layer library modal
  setLayerLibraryModalVisibility: React.PropTypes.func,
  // funcion to change visibility of the current layer
  toggleLayerVisibility: React.PropTypes.func
};

export default LayerLibrary;
