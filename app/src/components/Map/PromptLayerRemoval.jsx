import React, { Component } from 'react';
import classnames from 'classnames';
import recentVesselStyles from 'styles/components/map/c-recent-vessels.scss';
import ModalStyles from 'styles/components/shared/c-modal.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';


class PromptLayerRemoval extends Component {
  render() {
    return (
      <div className={recentVesselStyles['c-recent-vessels']} >
        <h3 className={ModalStyles['modal-title']} >Recent vessels</h3>
        <div className={recentVesselStyles['history-container']} >
          <p>
            You are about to remove a custom layer, which is part of your workspace and cannot be restored once deleted.
            Are you sure you want to proceed?
          </p>
        </div>
        <div className={recentVesselStyles.footer} >
          <button
            className={classnames(MapButtonStyles['c-button'], MapButtonStyles['-filled'], recentVesselStyles['btn-done'])}
            onClick={() => this.props.removeLayer(this.props.layerIdPromptedForRemoval)}
          >
            Yes
          </button>
          <button
            className={classnames(MapButtonStyles['c-button'], MapButtonStyles['-filled'], recentVesselStyles['btn-done'])}
            onClick={() => this.props.keepLayer()}
          >
            No
          </button>
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
