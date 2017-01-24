import React, { Component } from 'react';
import classnames from 'classnames';

import LayerManagementStyles from 'styles/components/map/c-layer-management.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';

class LayerManagement extends Component {
  componentWillMount() {
    this.props.openModal();
  }
  render() {
    return (
      <div className={LayerManagementStyles['c-layer-management']}>
        <button
          className={classnames(MapButtonStyles['c-button'], LayerManagementStyles['layer-button'])}
          onClick={() => this.props.openModal()}
        >
          add layers
        </button>
        <button className={classnames(MapButtonStyles['c-button'], LayerManagementStyles['layer-button'])}>edit layers</button>
      </div>
    );
  }
}

LayerManagement.propTypes = {
  openModal: React.PropTypes.func
};

export default LayerManagement;
