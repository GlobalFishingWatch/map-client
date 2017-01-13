import React, { Component } from 'react';
import LayerItem from 'components/Map/LayerItem';

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
    const canReport = (this.props.userPermissions.indexOf('reporting') !== -1);

    const layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        layers.push(
          <LayerItem
            key={i}
            layerIndex={i}
            layer={this.props.layers[i]}
            userCanReport={canReport}
            isCurrentlyReported={this.props.layers[i].id === this.props.currentlyReportedLayerId}
            toggleLayerVisibility={this.props.toggleLayerVisibility}
            toggleReport={this.props.toggleReport}
            setLayerOpacity={this.props.setLayerOpacity}
            setLayerHue={this.props.setLayerHue}
            openLayerInfoModal={this.props.setLayerInfoModal}
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
  currentlyReportedLayerId: React.PropTypes.number,
  toggleLayerVisibility: React.PropTypes.func,
  toggleReport: React.PropTypes.func,
  setLayerInfoModal: React.PropTypes.func,
  setLayerOpacity: React.PropTypes.func,
  setLayerHue: React.PropTypes.func,
  userPermissions: React.PropTypes.array
};


export default LayerPanel;
