import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import LayerLibrary from 'containers/Map/LayerLibrary';
import CustomLayer from 'containers/Map/CustomLayer';

import LayerManagementModalStyles from 'styles/components/map/c-layer-management-modal.scss';

class LayerLibraryModal extends Component {

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
          LayerManagementModalStyles['c-layer-management-modal'],
          { [`${LayerManagementModalStyles['-disabled']}`]: this.props.status === 'pending' }
        )}
      >
        <h3 className={LayerManagementModalStyles.title}>Add layer</h3>
        <div className={LayerManagementModalStyles['content-switcher']}>
          <span
            className={classnames(LayerManagementModalStyles['content-option'],
              { [`${LayerManagementModalStyles['-selected']}`]: this.state.display === 'library' })}
            onClick={() => this.setDisplay('library')}
          >
            layers library
          </span>
          <span
            className={classnames(LayerManagementModalStyles['content-option'],
              {
                [`${LayerManagementModalStyles['-selected']}`]: this.state.display === 'customLayer'
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

LayerLibraryModal.propTypes = {
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

export default LayerLibraryModal;
