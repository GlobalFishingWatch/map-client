import React, { Component } from 'react';
import classnames from 'classnames';
import recentVesselStyles from 'styles/components/map/c-recent-vessels.scss';
import ModalStyles from 'styles/components/shared/c-modal.scss';
import PromptLayerStyles from 'styles/components/map/c-prompt-layer.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';


class PromptLayerRemoval extends Component {
  render() {
    return (
      <div className={recentVesselStyles['c-recent-vessels']} >
        <h3 className={ModalStyles['modal-title']} >Delete confirmation</h3>
        <div className={PromptLayerStyles['c-prompt-layer']}>
          <p>
            You are about to remove a custom layer, which is part of your workspace and cannot be restored once deleted.
            Are you sure you want to proceed?
          </p>
          <div className={classnames(ModalStyles.footer, PromptLayerStyles.footer)} >
            <button
              className={classnames(MapButtonStyles['c-button'], MapButtonStyles['-filled'],
                PromptLayerStyles['modal-btn'])}
              onClick={() => this.props.removeLayer(this.props.layerIdPromptedForRemoval)}
            >
              Yes
            </button>
            <button
              className={classnames(MapButtonStyles['c-button'], MapButtonStyles['-filled'],
                PromptLayerStyles['modal-btn'])}
              onClick={() => this.props.keepLayer()}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
}

PromptLayerRemoval.propTypes = {
  layerIdPromptedForRemoval: React.PropTypes.any,
  removeLayer: React.PropTypes.func,
  keepLayer: React.PropTypes.func
};

export default PromptLayerRemoval;
