import React, { Component } from 'react';
import FiltersPanel from '../../containers/Map/FilterPanel';
import styles from '../../../styles/components/map/c-search-panel.scss';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visibleAdvancedSearch: false,
      search: '' // Current search i.e. what's inside the input
    };

    this.toggleVisibleAdvancedSearch = this.toggleVisibleAdvancedSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  /**
   * Handler called when the form is submitted i.e. when the user made a search
   *
   * @param {Object} e - event
   */
  onSubmit(e) {
    e.preventDefault();
    this.props.getSearchResults(this.state.search);
  }

  /**
   * Empty the search input and reset the search results
   */
  onClear() {
    this.setState({ search: '' });
    this.props.resetSearchResults();
  }

  /**
   * Toggle the advanced search filters
   */
  toggleVisibleAdvancedSearch() {
    this.setState({
      visibleAdvancedSearch: !this.state.visibleAdvancedSearch
    });
  }

  render() {
    const advancedSearch = (
      <div className={styles['advanced-search']}>
        <FiltersPanel />
        <button
          type="submit"
          className={styles['search-button']}
        >
          Search
        </button>
      </div>
    );

    const searchResults = [];
    if (this.props.searchResults.count === 0) {
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
        {this.state.visibleAdvancedSearch ? advancedSearch : null}
        <ul className={styles['search-results']}>
          {searchResults}
        </ul>
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
  drawVessel: React.PropTypes.func
};


export default SearchPanel;
