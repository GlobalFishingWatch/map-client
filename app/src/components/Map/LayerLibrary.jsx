import React, { Component } from 'react';

import LayerLibraryStyles from 'styles/components/map/c-layer-library.scss';
import LayerListStyles from 'styles/components/map/c-layer-list.scss';
import SwitcherStyles from 'styles/components/shared/c-switcher.scss';

import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';
import SearchIcon from 'babel!svg-react!assets/icons/search-icon.svg?name=SearchIcon';

class LayerLibraryModal extends Component {

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
        if (!layer.library) return;
        library.push(<li
          className={LayerLibraryStyles['layer-item']}
          key={i}
        >
          <label>
            <input
              className={SwitcherStyles['c-switcher']}
              type="checkbox"
              checked={layer.added}
              onChange={() => this.onChange(layer)}
              style={{
                color: layer.color
              }}
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
        <div className={LayerLibraryStyles['search-container']}>
          <input className={LayerLibraryStyles['search-input']} placeholder="Search layer" />
          <SearchIcon className={LayerLibraryStyles['search-icon']} />
        </div>
        {library &&
          <ul className={LayerLibraryStyles['layer-list']}>
            {library}
          </ul>}
        <div className={LayerLibraryStyles['footer-container']}>
          <button
            className={LayerLibraryStyles['done-button']}
            onClick={() => this.props.closeModal()}
          >
            done
          </button>
        </div>
      </div>
    );
  }
}

LayerLibraryModal.propTypes = {
  // array of layers available in the library
  layers: React.PropTypes.array,
  // triggers when user adds a layer
  addLayer: React.PropTypes.func,
  // function to close the modal
  closeModal: React.PropTypes.func,
  // triggers when user removes a layer
  removeLayer: React.PropTypes.func,
  // sets modal with info about the current layer
  setLayerInfoModal: React.PropTypes.func,
  // function to change visibility of the current layer
  toggleLayerVisibility: React.PropTypes.func
};

export default LayerLibraryModal;
