import React, { Component } from 'react';
import classnames from 'classnames';
import LayerLibrary from 'containers/Map/LayerLibrary';
import UploadLayer from 'containers/Map/UploadLayer';

import LayerMaganementModalStyles from 'styles/components/map/c-layer-management-modal.scss';

class LayerLibraryModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      display: 'upload'
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
          LayerMaganementModalStyles['c-layer-management-modal'],
          { [`${LayerMaganementModalStyles['-disabled']}`]: this.props.status === 'pending' }
        )}
      >
        <h3 className={LayerMaganementModalStyles.title}>Add layer</h3>
        <div className={LayerMaganementModalStyles['content-switcher']}>
          <span
            className={classnames(LayerMaganementModalStyles['content-option'],
              { [`${LayerMaganementModalStyles['-selected']}`]: this.state.display === 'library' })}
            onClick={() => this.setDisplay('library')}
          >
            layers library
          </span>
          <span
            className={classnames(LayerMaganementModalStyles['content-option'],
              { [`${LayerMaganementModalStyles['-selected']}`]: this.state.display === 'upload' })}
            onClick={() => this.setDisplay('upload')}
          >
            upload layer
          </span>
        </div>
        {this.state.display === 'library' && <LayerLibrary />}
        {this.state.display === 'upload' && <UploadLayer />}
      </div>
    );
  }
}

LayerLibraryModal.propTypes = {
  // array of layers available in the library
  layers: React.PropTypes.array,
  // triggers when user adds a layer
  addLayer: React.PropTypes.func,
  // triggers when user removes a layer
  removeLayer: React.PropTypes.func,
  // sets modal with info about the current layer
  setLayerInfoModal: React.PropTypes.func,
  // function to change visibility of the current layer
  toggleLayerVisibility: React.PropTypes.func,
  // modal loading status
  status: React.PropTypes.string
};

export default LayerLibraryModal;
