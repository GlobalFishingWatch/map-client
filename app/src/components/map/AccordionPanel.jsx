import React, { Component } from 'react';
import FiltersPanel from './filters_panel';
import ControlPanel from './control_panel';
import LayerPanel from './LayerPanel';
import layerPanelStyle from '../../../styles/components/c_layer_panel.scss';
import { Accordion, AccordionItem } from 'react-sanfona';

class AccordionPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hasSearchResults: false,
      visibleSearchResults: false,
      visibleAdvancedSearch: false
    };

    this.fakeSearchResults = this.fakeSearchResults.bind(this);
    this.toggleVisibleAdvancedSearch = this.toggleVisibleAdvancedSearch.bind(this);
    this.onFilterChange = this.props.onFilterChange.bind(this);
    this.onDrawDensityChange = this.props.onDrawDensityChange.bind(this);
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

  render() {
    let searchAccordionTitle = (
      <input
        onChange={this.fakeSearchResults}
        className={layerPanelStyle.input_accordion}
        placeholder="SEARCH VESSELS"
      />);

    let advancedSearchAccordionTitle = (
      <span
        onClick={this.toggleVisibleAdvancedSearch}
        className={layerPanelStyle.text_search}
      >
        {this.state.visibleAdvancedSearch ? 'hide advanced search' : 'advanced search'}
      </span>);

    // TODO sending a component for the accordion title value raise an Invalid prop error.
    // This might be fixed by this
    let advancedSearchAccordion = (
      <Accordion allowMultiple={false} activeItems={6}>
        <AccordionItem title={advancedSearchAccordionTitle} key="advancedsearch">
          <div className={layerPanelStyle.content_accordion}>
            <div>
              <FiltersPanel
                onChange={this.onFilterChange}
              />
              <span className={layerPanelStyle.button_advanced_search}>SEARCH</span>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    );

    let searchAccordion = (
      <AccordionItem
        title={searchAccordionTitle}
        key="search"
        className={layerPanelStyle.accordion_item}
      >
        <div className={layerPanelStyle.content_accordion}>
          <div>{advancedSearchAccordion}
            {this.state.visibleSearchResults && <ul className={layerPanelStyle.list_results}>
              <li>JOVE,<span>MMSI012345</span>
              </li>
              <li>JOVE,<span>MMSI012345</span>
              </li>
            </ul>}
          </div>
        </div>
      </AccordionItem>);

    let baseMapAccordion = (
      <AccordionItem
        title="Basemap"
        key="basemap"
        className={layerPanelStyle.accordion_item}
        titleClassName={layerPanelStyle.title_accordion}
      >
        <div className={layerPanelStyle.content_accordion}>
          <div className={layerPanelStyle.content_box}>
            <div className={layerPanelStyle.box_basemap}></div>
            <div className={layerPanelStyle.box_image_basemap}></div>
          </div>
        </div>
      </AccordionItem>);

    let layersAccordion = (
      <AccordionItem
        title="Layers"
        key="layers"
        className={layerPanelStyle.accordion_item}
        titleClassName={layerPanelStyle.title_accordion}
      >
        <LayerPanel
          layers={this.props.layers}
          onLayerToggle={this.props.onLayerToggle}
        />
      </AccordionItem>);

    let controlAccordion = (
      <AccordionItem
        title="Controls"
        key="control"
        className={layerPanelStyle.accordion_item}
        titleClassName={layerPanelStyle.title_accordion}
      >
        <div className={layerPanelStyle.content_accordion}>
          <ControlPanel
            onDrawDensityChange={this.onDrawDensityChange}
            startDate={this.props.startDate} endDate={this.props.endDate}
          />
        </div>
      </AccordionItem>);

    return (
      <div className={layerPanelStyle.layerPanel}>
        <Accordion allowMultiple={false} activeItems={6}>
          {searchAccordion}
          {baseMapAccordion}
          {layersAccordion}
          {controlAccordion}
        </Accordion>
      </div>
    );
  }
}

AccordionPanel.propTypes = {
  layers: React.PropTypes.array,
  startDate: React.PropTypes.number,
  endDate: React.PropTypes.number,
  onLayerToggle: React.PropTypes.func,
  onDrawDensityChange: React.PropTypes.func,
  onFilterChange: React.PropTypes.func
};

export default AccordionPanel;
