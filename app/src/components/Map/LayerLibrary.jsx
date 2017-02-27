import React, { Component } from 'react';
import classnames from 'classnames';
import LayerLibraryStyles from 'styles/components/map/c-layer-library.scss';
import LayerListStyles from 'styles/components/map/c-layer-list.scss';
import ButtonStyles from 'styles/components/map/c-button.scss';
import InfoIcon from 'babel!svg-react!assets/icons/info-icon.svg?name=InfoIcon';
import SearchIcon from 'babel!svg-react!assets/icons/search-icon.svg?name=SearchIcon';
import Toggle from 'components/Shared/Toggle';

const SHOW_SEARCH = false;

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
      this.props.layers.forEach((layer) => {
        if (!layer.library) return;
        library.push(<li
          className={LayerLibraryStyles['layer-item']}
          key={layer.title}
        >
          <label>
            <Toggle
              on={layer.added}
              hue={layer.hue}
              onToggled={() => this.onChange(layer)}
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
        {SHOW_SEARCH && <div className={LayerLibraryStyles['search-container']}>
          <input className={LayerLibraryStyles['search-input']} placeholder="Search layer" />
          <SearchIcon className={LayerLibraryStyles['search-icon']} />
        </div>
        }
        {library &&
          <div className={LayerLibraryStyles.wrapper}>
            <ul className={LayerLibraryStyles['layer-list']}>
              {library}
            </ul>
          </div>}
        <div className={LayerLibraryStyles['footer-container']}>
          <button
            className={classnames(ButtonStyles['c-button'], ButtonStyles['-filled'],
              ButtonStyles['-big'], LayerLibraryStyles['done-button'])}
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
  setLayerInfoModal: React.PropTypes.func
};

export default LayerLibraryModal;
