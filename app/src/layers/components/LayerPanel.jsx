import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LayerItem from 'layers/containers/LayerItem';
import LayerListStyles from 'styles/components/map/layer-list.scss';
import { LAYER_TYPES } from 'constants';
import classnames from 'classnames';

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
    const mapLayers = [];
    const fishingLayers = [];

    this.props.layers.forEach((layer, index) => {
      if (layer.added === false) {
        return;
      }
      if (layer.type === LAYER_TYPES.Heatmap) {
        fishingLayers.push(
          <LayerItem
            key={index}
            layerIndex={index}
            layer={layer}
            onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
            showBlending={this.state.currentBlendingOptionsShown === index}
          />
        );
      } else {
        mapLayers.push(
          <LayerItem
            key={index}
            layerIndex={index}
            layer={layer}
            onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
            showBlending={this.state.currentBlendingOptionsShown === index}
          />
        );
      }
    });

    return (
      <div className={LayerListStyles.layerListContainer} >
        <div className={LayerListStyles.title} >
          Fishing Layers
        </div >
        <ul className={LayerListStyles.layerList} >
          {fishingLayers}
        </ul >
        <div className={classnames(LayerListStyles.title, LayerListStyles.spacedTitle)} >
          Map Layers
        </div >
        <ul className={LayerListStyles.layerList} >
          {mapLayers}
        </ul >
      </div >
    );
  }
}

LayerPanel.propTypes = {
  layers: PropTypes.array,
  currentlyReportedLayerId: PropTypes.string,
  toggleLayerVisibility: PropTypes.func,
  setLayerInfoModal: PropTypes.func,
  setLayerOpacity: PropTypes.func,
  setLayerHue: PropTypes.func,
  userPermissions: PropTypes.array
};


export default LayerPanel;
