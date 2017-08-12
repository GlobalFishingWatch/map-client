import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import LayerManagementStyles from 'styles/components/map/layer-management.scss';
import MapButtonStyles from 'styles/components/map/button.scss';

class LayerManagement extends Component {
  render() {
    const editButtonText = (this.props.layerPanelEditMode === false) ? 'edit layers' : 'done';
    return (
      <div className={LayerManagementStyles.layerManagement} >
        <button
          className={classnames(MapButtonStyles.button, LayerManagementStyles.layerButton)}
          onClick={() => this.props.openModal()}
        >
          add layers
        </button >
        <button
          className={classnames(MapButtonStyles.button, LayerManagementStyles.layerButton,
            { [MapButtonStyles._disabled]: !this.props.workspaceLayers.filter(e => e.added === true).length > 0 },
            { [MapButtonStyles._filled]: !!this.props.layerPanelEditMode })}
          onClick={() => {
            this.props.toggleLayerPanelEditMode();
          }}
        >{editButtonText}</button >
      </div >
    );
  }
}

LayerManagement.propTypes = {
  openModal: PropTypes.func,
  workspaceLayers: PropTypes.array,
  toggleLayerPanelEditMode: PropTypes.func,
  layerPanelEditMode: PropTypes.bool
};

export default LayerManagement;
