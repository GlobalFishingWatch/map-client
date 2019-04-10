import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import LayerLibraryStyles from 'styles/components/map/layer-library.module.scss'
import LayerListStyles from 'styles/components/map/item-list.module.scss'
import ButtonStyles from 'styles/components/button.module.scss'
import IconStyles from 'styles/icons.module.scss'
import { ReactComponent as InfoIcon } from 'assets/icons/info.svg'
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg'
import Toggle from 'app/components/Shared/Toggle'

const SHOW_SEARCH = false

class LayerLibraryModal extends Component {
  onChange(layer) {
    if (layer.added) {
      this.props.removeLayer(layer.id)
    } else {
      this.props.addLayer(layer.id)
    }
  }

  onClickInfo(layer) {
    const modalParams = {
      open: true,
      info: layer,
    }

    this.props.setLayerInfoModal(modalParams)
  }

  render() {
    if (!this.props.layers) return null
    const library = []

    if (this.props.layers.length > 0) {
      this.props.layers.forEach((layer) => {
        if (!layer.library) return
        library.push(
          <li className={LayerLibraryStyles.listItem} key={layer.title}>
            <label>
              <Toggle
                on={layer.added}
                hue={layer.hue}
                color={layer.color}
                onToggled={() => this.onChange(layer)}
              />
              <span className={LayerListStyles.itemTitle}>{layer.title}</span>
            </label>
            <ul className={LayerListStyles.itemOptionList}>
              <li
                className={LayerListStyles.itemOptionItem}
                onClick={() => this.onClickInfo(layer)}
              >
                <InfoIcon className={IconStyles.infoIcon} />
              </li>
            </ul>
          </li>
        )
      })
    }

    return (
      <div className={LayerLibraryStyles.layerLibrary}>
        {SHOW_SEARCH && (
          <div className={LayerLibraryStyles.searchContainer}>
            <input className={LayerLibraryStyles.searchInput} placeholder="Search layer" />
            <SearchIcon className={LayerLibraryStyles.searchIcon} />
          </div>
        )}
        {library && (
          <div className={LayerLibraryStyles.wrapper}>
            <ul className={LayerLibraryStyles.list}>{library}</ul>
          </div>
        )}
        <div className={LayerLibraryStyles.footerContainer}>
          <button
            className={classnames(
              ButtonStyles.button,
              ButtonStyles._filled,
              ButtonStyles._big,
              LayerLibraryStyles.mainButton
            )}
            onClick={() => this.props.closeModal()}
          >
            done
          </button>
        </div>
      </div>
    )
  }
}

LayerLibraryModal.propTypes = {
  // array of layers available in the library
  layers: PropTypes.array,
  // triggers when user adds a layer
  addLayer: PropTypes.func,
  // function to close the modal
  closeModal: PropTypes.func,
  // triggers when user removes a layer
  removeLayer: PropTypes.func,
  // sets modal with info about the current layer
  setLayerInfoModal: PropTypes.func,
}

export default LayerLibraryModal
