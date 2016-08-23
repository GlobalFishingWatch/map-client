import React, { Component } from 'react';
import layerSupportModalStyle from '../../../styles/components/c-layer-back.scss';

class LayerSupportModal extends Component {

  render() {
    return (
      <div
        className={[layerSupportModalStyle['c-layer-back'],
        layerSupportModalStyle['-support-modal']].join(' ')}
        onClick={() => this.props.setVisibleSupportModal(false)}
      >
      </div>);
  }
}

LayerSupportModal.propTypes = {
  setVisibleSupportModal: React.PropTypes.func
};


export default LayerSupportModal;
