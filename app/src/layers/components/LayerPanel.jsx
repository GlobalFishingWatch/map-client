import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LayerItem from 'layers/containers/LayerItem';
import {
  LAYER_TYPES,
  LAYER_TYPES_DISPLAYED_IN_PANELS,
  LAYER_HAS_DISPLAY_SETTINGS,
  LAYER_HAS_LABELS,
  LAYER_HAS_COLOR_INPUTS
} from 'constants';
import classnames from 'classnames';
import ExpandItem from 'components/Shared/ExpandItem';
import AccordionHeader from 'components/Shared/AccordionHeader';
import BasemapPanel from 'basemap/containers/BasemapPanel';
import LayerManagement from 'layers/containers/LayerManagement';
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
    const staticLayers = [];
    const activityLayers = [];

    this.props.layers.forEach((layer, index) => {
      if (LAYER_TYPES_DISPLAYED_IN_PANELS.indexOf(layer.type) === -1 || layer.added === false) {
        return;
      }
      const layerItem = (<LayerItem
        key={`${index}${layer.id}`}
        layerIndex={index}
        layer={layer}
        onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
        showBlending={this.state.currentBlendingOptionsShown === index}
        enableLayerDisplaySettings={LAYER_HAS_DISPLAY_SETTINGS.indexOf(layer.type) > -1}
        enableLabels={LAYER_HAS_LABELS.indexOf(layer.type) > -1}
        enableColorInputs={LAYER_HAS_COLOR_INPUTS(layer.type, layer.subtype)}
      />);
      ((layer.type === LAYER_TYPES.Heatmap) ? activityLayers : staticLayers).push(layerItem);
    });

    return (
      <div>
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
            menuName={'Activity Layers'}
            openMenu={this.openMenu}
            expandState={this.state.expand}
          />
          <ExpandItem active={this.state.expand === 'ACTIVITY_LAYERS'} accordion >
            <ul className={LayerListStyles.list} >
              {activityLayers}
            </ul >
          </ExpandItem >
          <AccordionHeader
            menuName={'Static Layers'}
            openMenu={this.openMenu}
            expandState={this.state.expand}
          />
          <ExpandItem
            active={this.state.expand === 'STATIC_LAYERS'}
            isVesselInfoPanelOpen={this.props.isVesselInfoPanelOpen}
            accordion
          >
            <ul className={classnames(LayerListStyles.list, LayerListStyles.shadow)} >
              {staticLayers}
            </ul >
          </ExpandItem >
        </div>
        {this.state.expand !== null &&
          <LayerManagement />
        }
      </div>
    );
  }
}

LayerPanel.propTypes = {
  layers: PropTypes.array,
  isVesselInfoPanelOpen: PropTypes.bool.isRequired
};


export default LayerPanel;
