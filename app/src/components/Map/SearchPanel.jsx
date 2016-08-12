import React, { Component } from 'react';
import iso3311a2 from 'iso-3166-1-alpha-2';
import { FLAGS } from '../../constants';
import styles from '../../../styles/components/map/c-search-panel.scss';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visibleAdvancedSearch: false,
      search: '', // Current search i.e. what's inside the input
      flag: '' // Current selected flag
    };

    /* Map indexes to country names */
    this.countryNames = Object.keys(FLAGS).map(index => ({
      name: iso3311a2.getCountry(FLAGS[index]),
      id: index
    }))
      .filter(country => country.name)
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

    this.toggleVisibleAdvancedSearch = this.toggleVisibleAdvancedSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.renderAdvancedSearch = this.renderAdvancedSearch.bind(this);
  }

  /**
   * Handler called when the form is submitted i.e. when the user made a search
   *
   * @param {Object} e - event
   */
  onSubmit(e) {
    e.preventDefault();
    this.props.getSearchResults(this.state.search);
    this.props.updateFilters({ flag: this.state.flag });
  }

  /**
   * Empty the search input and reset the search results
   */
  onClear() {
    this.setState({ search: '', flag: '' });
    this.props.resetSearchResults();
    this.props.updateFilters({ flag: '' });
  }

  /**
   * Toggle the advanced search filters
   */
  toggleVisibleAdvancedSearch() {
    this.setState({
      visibleAdvancedSearch: !this.state.visibleAdvancedSearch
    });
  }

  renderSearchResults() {
    const searchResults = [];
    if (this.props.searchResults.count === 0 && this.state.search.length) {
      searchResults.push(<li key={0}>No result</li>);
    } else if (this.props.searchResults.count > 0) {
      for (let i = 0, length = this.props.searchResults.entries.length; i < length; i++) {
        searchResults.push(
          <li
            key={i}
            onClick={() => this.props.drawVessel(this.props.searchResults.entries[i])}
          >
            <span>{this.props.searchResults.entries[i].vesselname}</span>, {this.props.searchResults.entries[i].mmsi}
          </li>
        );
      }
    }

    return (
      <ul className={styles['search-results']}>
        {searchResults}
      </ul>
    );
  }

  renderAdvancedSearch() {
    if (!this.state.visibleAdvancedSearch) return null;

    const countries = Object.keys(this.countryNames).map(index =>
      <option
        value={this.countryNames[index].id}
        key={this.countryNames[index].id}
      >
        {this.countryNames[index].name}
      </option>
    );

    return (
      <div className={styles['advanced-search']}>
        <select
          id="ISOfilter"
          onChange={(e) => this.setState({ flag: e.target.value })}
          value={this.state.flag}
        >
          <option value="" key={-1}>Vessel flag (ISO code)</option>
          {countries}
        </select>
        <button
          type="submit"
          className={styles['search-button']}
        >
          Search
        </button>
      </div>
    );
  }

  render() {
    return (
      <form
        className={styles['c-search-panel']}
        onSubmit={this.onSubmit}
      >
        <input
          className={styles['search-input']}
          placeholder="Type your search criteria"
          value={this.state.search}
          onInput={e => this.setState({ search: e.currentTarget.value })}
        />
        <button
          className={styles['search-icon-button']}
          type="submit"
        >
          Search
        </button>
        <div className={styles['search-options']}>
          <button
            type="button"
            className={styles.option}
            onClick={this.onClear}
          >
            clear
          </button>
          <button
            type="button"
            className={styles.option}
            onClick={this.toggleVisibleAdvancedSearch}
          >
            {`${this.state.visibleAdvancedSearch ? 'hide' : ''} advanced search`}
          </button>
        </div>
        {this.renderAdvancedSearch()}
        {this.renderSearchResults()}
      </form>);
  }
}

SearchPanel.propTypes = {
  /**
   * Results of the search
   * { count: Number, entries: Array }
   */
  searchResults: React.PropTypes.object,
  /**
   * Get the results of a search
   */
  getSearchResults: React.PropTypes.func,
  /**
   * Reset the search results
   */
  resetSearchResults: React.PropTypes.func,
  /**
   * Draw a vessel on the map
   */
  drawVessel: React.PropTypes.func,
  /**
   * Update the filters
   */
  updateFilters: React.PropTypes.func
};


export default SearchPanel;
