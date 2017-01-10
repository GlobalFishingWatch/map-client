import React, { Component } from 'react';

import LayerManagementStyles from 'styles/components/map/c-layer-management.scss';

class LayerManagement extends Component {
  render() {
    return (
      <div className={LayerManagementStyles['c-layer-management']}>
        <button onClick={() => this.props.openModal()}>add layers</button>
        <button>edit layers</button>
      </div>
    );
  }
}

LayerManagement.propTypes = {
  openModal: React.PropTypes.func
};

export default LayerManagement;
