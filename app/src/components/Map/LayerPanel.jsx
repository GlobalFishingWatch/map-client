import React, { Component } from 'react';
import LayerItem from './LayerItem';
import layerPanelStyle from '../../../styles/components/map/c-layer-panel.scss';


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
      <div className={layerPanelStyle['c-layer-panel']}>
        <ul className={layerPanelStyle['layer-list']}>
          {layers}
        </ul>
      </div>
    );
  }
}

LayerPanel.propTypes = {
  layers: React.PropTypes.array,
  toggleLayerVisibility: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func
};


export default LayerPanel;
