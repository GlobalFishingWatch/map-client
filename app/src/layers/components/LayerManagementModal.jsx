import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import LayerLibrary from 'layers/containers/LayerLibrary';
import CustomLayer from 'layers/containers/CustomLayer';
import LayerManagementModalStyles from 'styles/components/map/layer-management-modal.scss';

class LayerManagementModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      display: 'library'
    };
  }

  setDisplay(display) {
    this.setState({
      display
    });
  }

  render() {
    return (
      <div
        className={classnames(
          LayerManagementModalStyles.layerManagementModal,
          { [`${LayerManagementModalStyles._disabled}`]: this.props.status === 'pending' }
        )}
      >
        <h3 className={LayerManagementModalStyles.title}>Add layer</h3>
        <div className={LayerManagementModalStyles.contentSwitcher}>
          <span
            className={classnames(LayerManagementModalStyles.contentOption,
              { [`${LayerManagementModalStyles._selected}`]: this.state.display === 'library' })}
            onClick={() => this.setDisplay('library')}
          >
            layers library
          </span>
          <span
            className={classnames(LayerManagementModalStyles.contentOption,
              {
                [`${LayerManagementModalStyles._selected}`]: this.state.display === 'customLayer'
              })}
            onClick={() => this.setDisplay('customLayer')}
          >
            custom layer
          </span>
        </div>
        {this.state.display === 'library' && <LayerLibrary />}
        {this.state.display === 'customLayer' && <CustomLayer />}
      </div>
    );
  }
}

LayerManagementModal.propTypes = {
  // array of layers available in the library
  layers: PropTypes.array,
  // triggers when user adds a layer
  addLayer: PropTypes.func,
  // triggers when user removes a layer
  removeLayer: PropTypes.func,
  // sets modal with info about the current layer
  setLayerInfoModal: PropTypes.func,
  // modal loading status
  status: PropTypes.string
};

export default LayerManagementModal;
