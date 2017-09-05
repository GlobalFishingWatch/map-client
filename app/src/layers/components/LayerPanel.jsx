import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LayerItem from 'layers/containers/LayerItem';
import { LAYER_TYPES } from 'constants';
import classnames from 'classnames';
import ExpandItem from 'components/Shared/ExpandItem';
import AccordionHeader from 'components/Shared/AccordionHeader';
import BasemapPanel from 'basemap/containers/BasemapPanel';
import LayerListStyles from 'styles/components/map/item-list.scss';
import AccordionStyles from 'styles/components/shared/accordion.scss';

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
      const layerItem = (<LayerItem
        key={`${index}${layer.id}`}
        layerIndex={index}
        layer={layer}
        onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
        showBlending={this.state.currentBlendingOptionsShown === index}
      />);
      ((layer.type === LAYER_TYPES.Heatmap) ? fishingLayers : mapLayers).push(layerItem);
    });

    return (
      <div className={AccordionStyles.accordion}>
        <AccordionHeader
          menuName={'Basemaps'}
          openMenu={this.openMenu}
          expandState={this.state.expand}
        />
        <ExpandItem active={this.state.expand === 'BASEMAPS'} accordion >
          <BasemapPanel />
        </ExpandItem >
        <AccordionHeader
          menuName={'Fishing Layers'}
          openMenu={this.openMenu}
          expandState={this.state.expand}
        />
        <ExpandItem active={this.state.expand === 'FISHING_LAYERS'} accordion >
          <ul className={LayerListStyles.list} >
            {fishingLayers}
          </ul >
        </ExpandItem >
        <AccordionHeader
          menuName={'Map Layers'}
          openMenu={this.openMenu}
          expandState={this.state.expand}
        />
        <ExpandItem active={this.state.expand === 'MAP_LAYERS'} accordion >
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
