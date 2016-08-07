import React, { Component } from 'react';
import SettingsPanel from './SettingsPanel';
import LayerPanel from '../../containers/map/LayerPanel';
import SearchPanel from '../../containers/map/SearchPanel';
import controlPanelStyle from '../../../styles/components/c-control_panel.scss';
import { Accordion, AccordionItem } from 'react-sanfona';

class ControlPanel extends Component {

  renderSearch() {
    return (
      <AccordionItem
        title="SEARCH VESSELS"
        key="search"
        className={controlPanelStyle.accordion_item}
        titleClassName={controlPanelStyle.title_accordion}
      >
        <div className={controlPanelStyle.content_accordion}>
          <SearchPanel />
        </div>
      </AccordionItem>);
  }

  renderBasemap() {
    return (
      <AccordionItem
        title="Basemap"
        key="basemap"
        className={controlPanelStyle.accordion_item}
        titleClassName={controlPanelStyle.title_accordion}
      >
        <div className={controlPanelStyle.content_accordion}>
          <div className={controlPanelStyle.content_box}>
            <div className={controlPanelStyle.box_basemap}></div>
            <div className={controlPanelStyle.box_image_basemap}></div>
          </div>
        </div>
      </AccordionItem>);
  }

  renderLayerPicker() {
    return (
      <AccordionItem
        title="Layers"
        key="layers"
        className={controlPanelStyle.accordion_item}
        titleClassName={controlPanelStyle.title_accordion}

      >
        <div className={controlPanelStyle.content_accordion}>
          <LayerPanel />
        </div>
      </AccordionItem>);
  }

  renderSettings() {
    return (
      <AccordionItem
        title="Settings"
        key="settings"
        className={controlPanelStyle.accordion_item}
        titleClassName={controlPanelStyle.title_accordion}
      >
        <div className={controlPanelStyle.content_accordion}>
          <SettingsPanel
            updateVesselTransparency={this.updateVesselTransparency}
          />
        </div>
      </AccordionItem>);
  }

  render() {
    return (
      <div className={controlPanelStyle.controlPanel}>
        <Accordion allowMultiple={false} activeItems={6}>
          {this.renderSearch()}
          {this.renderBasemap()}
          {this.renderLayerPicker()}
          {this.renderSettings()}
        </Accordion>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  layers: React.PropTypes.array,
  vesselTransparency: React.PropTypes.number,
  updateVesselTransparency: React.PropTypes.func
};


export default ControlPanel;
