import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LayerItem from 'layers/containers/LayerItem';
import { LAYER_TYPES } from 'constants';
import classnames from 'classnames';
import ExpandItem from 'components/Shared/ExpandItem';
import CarouselHeader from 'components/Shared/CarouselHeader';
import BasemapPanel from 'basemap/containers/BasemapPanel';
import LayerListStyles from 'styles/components/map/item-list.scss';
import CarouselStyles from 'styles/components/shared/carousel.scss';

class LayerPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBlendingOptionsShown: -1,
      expand: null
    };
    this.openMenu = this.openMenu.bind(this);
  }

  onLayerBlendingToggled(layerIndex) {
    let currentBlendingOptionsShown = layerIndex;
    if (currentBlendingOptionsShown === this.state.currentBlendingOptionsShown) {
      currentBlendingOptionsShown = -1;
    }
    this.setState({ currentBlendingOptionsShown });
  }

  openMenu(value) {
    if (value === this.state.expand) value = null;
    this.setState({ expand: value });
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
            key={`${index}${layer.id}`}
            layerIndex={index}
            layer={layer}
            onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
            showBlending={this.state.currentBlendingOptionsShown === index}
          />
        );
      } else {
        mapLayers.push(
          <LayerItem
            key={`${index}${layer.id}`}
            layerIndex={index}
            layer={layer}
            onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
            showBlending={this.state.currentBlendingOptionsShown === index}
          />
        );
      }
    });

    return (
      <div className={CarouselStyles.carousel}>
        <CarouselHeader
          menuName={'Basemaps'}
          openMenu={this.openMenu}
          expandState={this.state.expand}
        />
        <ExpandItem active={this.state.expand === 'BASEMAPS'} carousel >
          <BasemapPanel />
        </ExpandItem >
        <CarouselHeader
          menuName={'Fishing Layers'}
          openMenu={this.openMenu}
          expandState={this.state.expand}
        />
        <ExpandItem active={this.state.expand === 'FISHING_LAYERS'} carousel >
          <ul className={LayerListStyles.list} >
            {fishingLayers}
          </ul >
        </ExpandItem >
        <CarouselHeader
          menuName={'Map Layers'}
          openMenu={this.openMenu}
          expandState={this.state.expand}
        />
        <ExpandItem active={this.state.expand === 'MAP_LAYERS'} carousel >
          <ul className={classnames(LayerListStyles.list, LayerListStyles.shadow)} >
            {mapLayers}
          </ul >
        </ExpandItem >
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
