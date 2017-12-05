import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import ModalStyles from 'styles/components/shared/modal.scss';
import PromptLayerStyles from 'styles/components/map/prompt-layer.scss';
import MapButtonStyles from 'styles/components/button.scss';
import Modal from 'components/Shared/Modal';

class PromptLayerRemovalModal extends Component {
  renderMainContent() {
    return (
      <div>
        <h3 className={ModalStyles.modalTitle} >Delete layer</h3>
        <div className={PromptLayerStyles.promptLayer}>
          <p
            className={PromptLayerStyles.layerDescription}
          >
            You are about to remove a custom layer, which is part of your workspace and cannot be restored from
            the layer library once deleted.
          </p>
          <p
            className={PromptLayerStyles.layerDescription}
          >
            Are you sure you want to proceed?
          </p>
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div className={classnames(ModalStyles.buttonFooter, PromptLayerStyles.footer)} >
        <button
          className={classnames(MapButtonStyles.button, MapButtonStyles._filled,
            PromptLayerStyles.modalBtn)}
          onClick={() => this.props.removeLayer(this.props.layerIdPromptedForRemoval)}
        >
          Yes, delete
        </button>
        <button
          className={classnames(MapButtonStyles.button, PromptLayerStyles.modalBtn)}
          onClick={() => this.props.keepLayer()}
        >
          Cancel
        </button>
      </div>
    );
  }
  render() {
    return (
      <div >
        <Modal
          opened={this.props.opened}
          close={this.props.close}
          visible={this.props.visible}
          closeable
          isSmall
          isScrollable
          footer={this.renderFooter()}
        >
          {this.renderMainContent()}
        </Modal >
      </div>
    );
  }
}

PromptLayerRemovalModal.propTypes = {
  layerIdPromptedForRemoval: PropTypes.any,
  removeLayer: PropTypes.func,
  keepLayer: PropTypes.func,
  opened: PropTypes.bool,
  visible: PropTypes.bool,
  close: PropTypes.bool
};

export default PromptLayerRemovalModal;
