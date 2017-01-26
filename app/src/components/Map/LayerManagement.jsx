import React, { Component } from 'react';
import classnames from 'classnames';
import LayerManagementStyles from 'styles/components/map/c-layer-management.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';

class LayerManagement extends Component {
  render() {
    const editButtonText = (this.props.layerPanelEditMode === false) ? 'edit layers' : 'done';
    return (
      <div className={LayerManagementStyles['c-layer-management']} >
        <button
          className={classnames(MapButtonStyles['c-button'], LayerManagementStyles['layer-button'])}
          onClick={() => this.props.openModal()}
        >
          add layers
        </button>
        <button
          className={classnames(MapButtonStyles['c-button'], LayerManagementStyles['layer-button'],
          { [`${MapButtonStyles['-disabled']}`]: !this.props.workspaceLayers.filter(e => e.added === true).length > 0 },
          { [`${MapButtonStyles['-filled']}`]: !!this.props.layerPanelEditMode })}
          onClick={() => {
            this.props.toggleLayerPanelEditMode();
          }}
        >{editButtonText}</button>
      </div>
    );
  }
}

LayerManagement.propTypes = {
  openModal: React.PropTypes.func,
  workspaceLayers: React.PropTypes.array,
  toggleLayerPanelEditMode: React.PropTypes.func,
  layerPanelEditMode: React.PropTypes.bool
};

export default LayerManagement;
