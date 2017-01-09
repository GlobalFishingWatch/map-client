import React, { Component } from 'react';

import LayerManagementStyles from 'styles/components/map/c-layer-management.scss';

class LayerManagement extends Component {
  render() {
    return (
      <div className={LayerManagementStyles['c-layer-management']}>
        <button onClick={() => this.props.setLayerLibraryModalVisivility()}>add layers</button>
        <button>edit layers</button>
      </div>
    );
  }
}

LayerManagement.propTypes = {
  setLayerLibraryModalVisivility: React.PropTypes.func
};

export default LayerManagement;
