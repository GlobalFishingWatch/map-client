import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import LayerLibrary from 'app/layers/containers/LayerLibrary'
import CustomLayer from 'app/layers/containers/CustomLayer'
import Loader from 'app/mapPanels/leftControlPanel/components/Loader'
import LayerManagementModalStyles from 'styles/components/map/layer-management-modal.module.scss'

class LayerManagementModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: 'library',
    }
  }

  setDisplay(display) {
    this.setState({
      display,
    })
  }

  render() {
    const isLoading = this.props.status === 'pending'
    return (
      <div
        className={classnames(LayerManagementModalStyles.layerManagementModal, {
          [`${LayerManagementModalStyles._disabled}`]: isLoading,
        })}
      >
        <h3 className={LayerManagementModalStyles.title}>Add layer</h3>
        <div className={LayerManagementModalStyles.contentSwitcher}>
          <span
            className={classnames(LayerManagementModalStyles.contentOption, {
              [`${LayerManagementModalStyles._selected}`]: this.state.display === 'library',
            })}
            onClick={() => this.setDisplay('library')}
          >
            layers library
          </span>
          <span
            className={classnames(LayerManagementModalStyles.contentOption, {
              [`${LayerManagementModalStyles._selected}`]: this.state.display === 'customLayer',
            })}
            onClick={() => this.setDisplay('customLayer')}
          >
            custom layer
          </span>
        </div>
        {this.state.display === 'library' && <LayerLibrary />}
        {this.state.display === 'customLayer' && <CustomLayer />}
        {isLoading && (
          <div className={LayerManagementModalStyles.layerManagementModalLoading}>
            <Loader visible />
          </div>
        )}
      </div>
    )
  }
}

LayerManagementModal.propTypes = {
  // modal loading status
  status: PropTypes.string,
}

export default LayerManagementModal
