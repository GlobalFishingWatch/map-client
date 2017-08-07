import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import classnames from 'classnames';
import ModalStyles from 'styles/components/shared/modal.scss';
import PromptLayerStyles from 'styles/components/map/prompt-layer.scss';
import MapButtonStyles from 'styles/components/map/button.scss';

class PromptLayerRemoval extends Component {
  render() {
    return (
      <div >
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
          <div className={classnames(ModalStyles.footer, PromptLayerStyles.footer)} >
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
        </div>
      </div>
    );
  }
}

PromptLayerRemoval.propTypes = {
  layerIdPromptedForRemoval: PropTypes.any,
  removeLayer: PropTypes.func,
  keepLayer: PropTypes.func
};

export default PromptLayerRemoval;
