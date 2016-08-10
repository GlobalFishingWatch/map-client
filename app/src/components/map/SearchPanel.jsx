import React, { Component } from 'react';
import FiltersPanel from '../../containers/map/FilterPanel';
import controlPanelStyle from '../../../styles/components/c-control_panel.scss';
import { Accordion, AccordionItem } from 'react-sanfona';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visibleAdvancedSearch: false
    };

    this.toggleVisibleAdvancedSearch = this.toggleVisibleAdvancedSearch.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
  }

  onSearchInputChange(event) {
    this.props.getSearchResults(event.target.value);
  }

  toggleVisibleAdvancedSearch() {
    this.setState({
      visibleAdvancedSearch: !this.state.visibleAdvancedSearch
    });
  }

  render() {
    let advancedSearchAccordion = (
      <Accordion
        allowMultiple={false}
        activeItems={6}
        onChange={this.toggleVisibleAdvancedSearch}
      >
        <AccordionItem
          title={this.state.visibleAdvancedSearch ? 'hide advanced search' : 'advanced search'}
          key="advancedsearch"
          titleClassName={controlPanelStyle.text_search}
        >
          <div>
            <FiltersPanel />
            <span className={controlPanelStyle.button_advanced_search}>SEARCH</span>
          </div>
        </AccordionItem>
      </Accordion>
    );

    let searchResults = [];
    if (this.props.search && !this.state.visibleAdvancedSearch) {
      for (let i = 0, length = this.props.search.entries.length; i < length; i++) {
        searchResults.push(
          <li
            key={i}
            onClick={() => this.props.drawVessel(this.props.search.entries[i])}
          >
            {this.props.search.entries[i].vesselname},<span>{this.props.search.entries[i].mmsi}</span>
          </li>
        );
      }
    }

    return (
      <div>
        <input
          onChange={this.onSearchInputChange}
          className={controlPanelStyle.input_accordion}
          placeholder="Type your search query"
        />
        {advancedSearchAccordion}
        <ul className={controlPanelStyle.list_results}>
          {searchResults}
        </ul>
      </div>);
  }
}

SearchPanel.propTypes = {
  search: React.PropTypes.object,
  getSearchResults: React.PropTypes.func,
  drawVessel: React.PropTypes.func
};


export default SearchPanel;
