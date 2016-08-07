import React, { Component } from 'react';
import FiltersPanel from './FilterPanel';
import SettingsPanel from './SettingsPanel';
import LayerPanel from '../../containers/map/LayerPanel';
import controlPanelStyle from '../../../styles/components/c-control_panel.scss';
import { Accordion, AccordionItem } from 'react-sanfona';

class ControlPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hasSearchResults: false,
      visibleSearchResults: false,
      visibleAdvancedSearch: false
    };

    this.fakeSearchResults = this.fakeSearchResults.bind(this);
    this.toggleVisibleAdvancedSearch = this.toggleVisibleAdvancedSearch.bind(this);
    this.updateFilters = this.props.updateFilters.bind(this);
  }

  fakeSearchResults(event) {
    this.setState({
      hasSearchResults: !!event.target.value.length,
      visibleSearchResults: !!event.target.value.length && !this.state.visibleAdvancedSearch
    });
  }

  toggleVisibleAdvancedSearch() {
    this.setState({
      visibleAdvancedSearch: !this.state.visibleAdvancedSearch,
      visibleSearchResults: this.state.visibleAdvancedSearch && this.state.hasSearchResults
    });
  }

  renderSearch() {
    let advancedSearchAccordion = (
      <Accordion allowMultiple={false} activeItems={6}>
        <AccordionItem
          title={this.state.visibleAdvancedSearch ? 'hide advanced search' : 'advanced search'}
          key="advancedsearch"
          titleClassName={controlPanelStyle.text_search}
          onClick={this.toggleVisibleAdvancedSearch}
        >
          <div>
            <FiltersPanel
              onChange={this.updateFilters}
            />
            <span className={controlPanelStyle.button_advanced_search}>SEARCH</span>
          </div>
        </AccordionItem>
      </Accordion>
    );

    /**
     * TODO sending a component for the accordion title value raise an Invalid prop error.
     * @see https://github.com/daviferreira/react-sanfona/issues/79
     */
    let searchAccordionTitle = (
      <input
        onChange={this.fakeSearchResults}
        className={controlPanelStyle.input_accordion}
        placeholder="SEARCH VESSELS"
      />);

    return (
      <AccordionItem
        title={searchAccordionTitle}
        key="search"
        className={controlPanelStyle.accordion_item}
      >
        <div className={controlPanelStyle.content_accordion}>
          <div>{advancedSearchAccordion}
            {this.state.visibleSearchResults && <ul className={controlPanelStyle.list_results}>
              <li>JOVE,<span>MMSI012345</span>
              </li>
              <li>JOVE,<span>MMSI012345</span>
              </li>
            </ul>}
          </div>
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
        <LayerPanel />
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
  updateVesselTransparency: React.PropTypes.func,
  updateFilters: React.PropTypes.func
};


export default ControlPanel;
