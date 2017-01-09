import React, { Component } from 'react';

import LayerItem from 'components/Map/LayerItem';

import LayerLibraryStyles from 'styles/components/map/c-layer-management.scss';
import LayerListStyles from 'styles/components/map/c-layer-list.scss';

class LayerLibrary extends Component {

  render() {
    if (!this.props.layers) return null;

    const library = [];

    if (this.props.layers.length > 0) {
      this.props.layers.forEach((layer, i) => {
        library.push(<LayerItem
          key={i}
          layerIndex={i}
          layer={layer}
          layerLibraryDisplay
          toggleLayerVisibility={this.props.toggleLayerVisibility}
          openLayerInfoModal={this.props.setLayerInfoModal}
        />);
      });
    }

    return (
      <div className={LayerLibraryStyles['c-layer-library']}>
        {library &&
          <ul className={LayerListStyles['c-layer-list']}>
            {library}
          </ul>}
      </div>
    );
  }
}

LayerLibrary.propTypes = {
  // array of layers available in the library
  layers: React.PropTypes.array,
  // function to get all available layers
  setLayerLibrary: React.PropTypes.func,
  // sets modal with info about the current layer
  setLayerInfoModal: React.PropTypes.func,
  // function to set visibility of the layer library modal
  setLayerLibraryModalVisivility: React.PropTypes.func,
  // funcion to change visibility of the current layer
  toggleLayerVisibility: React.PropTypes.func
};

export default LayerLibrary;
