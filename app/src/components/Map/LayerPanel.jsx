import React, { Component } from 'react';
import LayerItem from 'containers/Map/LayerItem';
import LayerListStyles from 'styles/components/map/c-layer-list.scss';

class LayerPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { currentBlendingOptionsShown: -1 };
  }

  onLayerBlendingToggled(layerIndex) {
    let currentBlendingOptionsShown = layerIndex;
    if (currentBlendingOptionsShown === this.state.currentBlendingOptionsShown) {
      currentBlendingOptionsShown = -1;
    }
    this.setState({ currentBlendingOptionsShown });
  }

  render() {
    const layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        if (this.props.layers[i].added === false) {
          continue;
        }
        layers.push(
          <LayerItem
            key={i}
            layerIndex={i}
            layer={this.props.layers[i]}
            onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
            showBlending={this.state.currentBlendingOptionsShown === i}
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
  currentlyReportedLayerId: React.PropTypes.string,
  toggleLayerVisibility: React.PropTypes.func,
  toggleReport: React.PropTypes.func,
  setLayerInfoModal: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func,
  setLayerHue: React.PropTypes.func,
  userPermissions: React.PropTypes.array
};


export default LayerPanel;
