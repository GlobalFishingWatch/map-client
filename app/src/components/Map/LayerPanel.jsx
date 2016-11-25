import React, { Component } from 'react';
import LayerItem from './LayerItem';

import LayerListStyles from 'styles/components/map/c-layer-list.scss';


class LayerPanel extends Component {

  render() {
    const layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        layers.push(
          <LayerItem
            key={i}
            layer={this.props.layers[i]}
            toggleLayerVisibility={this.props.toggleLayerVisibility}
            setLayerOpacity={this.props.setLayerOpacity}
          />
        );
      }
    }

    return (
      <ul className={LayerListStyles['c-layer-list']}>
        {layers}
      </ul>
    );
  }
}

LayerPanel.propTypes = {
  layers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func
};


export default LayerPanel;
