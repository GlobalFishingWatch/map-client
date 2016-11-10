import React, { Component } from 'react';
import FiltersPanel from './FiltersPanel';
import LayerPanel from '../../containers/Map/LayerPanel';
import SearchPanel from '../../containers/Map/SearchPanel';
import controlPanelStyle from '../../../styles/components/c-control_panel.scss';
import { Accordion, AccordionItem } from 'react-sanfona';

class ControlPanel extends Component {

  constructor() {
    super();
    this.state = {
      searchVisible: false
    };
  }

  closeVesselInfo() {
    // if it's already closed, do nothing
    if (!this.props.vesselVisibility) return;

    this.props.toggleVisibility(false);
  }

  renderSearch() {
    return (
      <AccordionItem
        title="SEARCH VESSELS"
        key="search"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
        onExpand={() => this.setState({ searchVisible: true })}
        onClose={() => this.setState({ searchVisible: false })}
      >
        <div className={controlPanelStyle['content-accordion']}>
          <SearchPanel visible={this.state.searchVisible} />
        </div>
      </AccordionItem>);
  }

  renderBasemap() {
    return (
      <AccordionItem
        title="Basemap"
        key="basemap"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
      >
        <div className={controlPanelStyle['content-accordion']}>
          <ul className={controlPanelStyle['basemap-list']}>
            <li className={controlPanelStyle.basemap}>
              <img alt="basemap X" src="#" className="basemap-img" />
            </li>
            <li className={controlPanelStyle.basemap}>
              <img alt="basemap Y" src="#" className="basemap-img" />
            </li>
          </ul>
        </div>
      </AccordionItem>);
  }

  renderLayerPicker() {
    return (
      <AccordionItem
        title="Layers"
        key="layers"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}

      >
        <div className={controlPanelStyle['content-accordion']}>
          <LayerPanel />
        </div>
      </AccordionItem>);
  }

  renderResume() {
    return (
      <div className={controlPanelStyle['resume-display']}>
        <div className={controlPanelStyle['total-count']}>
          <span className={controlPanelStyle['counter-description']}>vessel activity</span>
          <span className={controlPanelStyle.total}>224,654</span>
        </div>
        <div className={controlPanelStyle['categories-display']}>
          <div className={controlPanelStyle['vessel-display']}>
            <span className={controlPanelStyle['counter-description']}>vessels</span>
            <span className={controlPanelStyle.total}>224,654</span>
          </div>
          <div className={controlPanelStyle['activity-display']}>
            <span className={controlPanelStyle['counter-description']}>activity</span>
            <span className={controlPanelStyle.total}>224,654</span>
          </div>
        </div>
      </div>
    );
  }

  renderFilters() {
    return (
      <AccordionItem
        title="Filters"
        key="filters"
        className={controlPanelStyle['accordion-item']}
        titleClassName={controlPanelStyle['title-accordion']}
      >
        <div className={controlPanelStyle['content-accordion']}>
          <FiltersPanel
            updateVesselTransparency={this.props.updateVesselTransparency}
            vesselTransparency={this.props.vesselTransparency}
            updateVesselColor={this.props.updateVesselColor}
            vesselColor={this.props.vesselColor}
          />
        </div>
      </AccordionItem>);
  }

  render() {
    return (
      <div className={controlPanelStyle.controlpanel}>
        {this.renderResume()}
        <Accordion
          activeItems={6}
          allowMultiple={false}
          className={controlPanelStyle['map-options']}
          onChange={() => this.closeVesselInfo()}
        >
          {this.renderSearch()}
          {this.renderBasemap()}
          {this.renderLayerPicker()}
          {this.renderFilters()}
        </Accordion>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  toggleVisibility: React.PropTypes.func,
  layers: React.PropTypes.array,
  updateVesselTransparency: React.PropTypes.func,
  vesselTransparency: React.PropTypes.number,
  updateVesselColor: React.PropTypes.func,
  vesselColor: React.PropTypes.string,
  vesselVisibility: React.PropTypes.bool
};


export default ControlPanel;
