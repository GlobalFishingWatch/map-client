import React, { Component } from 'react';
import FiltersPanel from './filters_panel';
import ControlPanel from './control_panel';
import layerPanel from '../../../styles/components/c_layer_panel.scss';
import { Accordion, AccordionItem } from 'react-sanfona';

class LayerPanel extends Component {

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
    let layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        layers.push(
          <li className={layerPanel.list_checkbox} key={i}>
            <label>
              <input
                type="checkbox"
                checked={this.props.layers[i].visible}
                onChange={() => this.props.onLayerToggle(this.props.layers[i])}
              />
              {this.props.layers[i].title}
            </label>
          </li>
        );
      }
    }

    let searchAccordionTitle = (
      <input
        onChange={this.fakeSearchResults}
        className={layerPanel.input_accordion}
        placeholder="SEARCH VESSELS"
      />);

    let baseMapAccordionTitle = (
      <div className={layerPanel.title_accordion}>Basemap
        <div className={layerPanel.content_box}>
          <div className={layerPanel.box_basemap}></div>
          <div className={layerPanel.box_image_basemap}></div>
        </div>
      </div>);
    let layersAccordionTitle = (<span className={layerPanel.title_accordion}>Layers</span>);
    let controlAccordionTitle = (<span className={layerPanel.title_accordion}>Control</span>);
    let advancedSearchAccordionTitle = (
      <span
        onClick={this.toggleVisibleAdvancedSearch}
        className={layerPanel.text_search}
      >
        {this.state.visibleAdvancedSearch ? 'hide advanced search' : 'advanced search'}
      </span>);


    let advancedSearchAccordion = (
      <Accordion allowMultiple={false} activeItems={6}>
        <AccordionItem title={advancedSearchAccordionTitle} key="advancedsearch">
          <div className={layerPanel.content_accordion}>
            <div>
              <FiltersPanel
                onChange={this.onFilterChange}
              />
              <span className={layerPanel.button_advanced_search}>SEARCH</span>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    );

    let searchAccordion = (
      <AccordionItem
        title={searchAccordionTitle}
        key="search"
        className={layerPanel.accordion_item}
      >
        <div className={layerPanel.content_accordion}>
          <div>{advancedSearchAccordion}
            {this.state.visibleSearchResults && <ul className={layerPanel.list_results}>
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
        title={baseMapAccordionTitle}
        key="basemap"
        className={layerPanel.accordion_item}
      >
        <div className={layerPanel.content_accordion}>
          <p />
        </div>
      </AccordionItem>);

    let layersAccordion = (
      <AccordionItem
        title={layersAccordionTitle}
        key="layers"
        className={layerPanel.accordion_item}
      >
        <div className={layerPanel.content_accordion}>
          <ul>{layers}</ul>
        </div>
      </AccordionItem>);

    let controlAccordion = (
      <AccordionItem
        title={controlAccordionTitle} key="control"
        className={layerPanel.accordion_item}
      >
        <div className={layerPanel.content_accordion}>
          <ControlPanel
            onDrawDensityChange={this.onDrawDensityChange}
            startDate={this.props.startDate} endDate={this.props.endDate}
          />
        </div>
      </AccordionItem>);

    return (
      <div className={layerPanel.layerPanel}>
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

LayerPanel.propTypes = {
  layers: React.PropTypes.array,
  startDate: React.PropTypes.number,
  endDate: React.PropTypes.number,
  onLayerToggle: React.PropTypes.func,
  onDrawDensityChange: React.PropTypes.func,
  onFilterChange: React.PropTypes.func
};


export default LayerPanel;
