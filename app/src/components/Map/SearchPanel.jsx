import React, { Component } from 'react';
import classnames from 'classnames';

import SearchResult from './SearchResult';
import iconsStyles from '../../../styles/icons.scss';
import searchPanelStyles from '../../../styles/components/map/c-search-panel.scss';

import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=CloseIcon';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.defaults = {
      characterLimit: 3
    };

    this.state = {
      keyword: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.searchField.focus();
    }
  }

  onSearchInputChange(event) {
    const keyword = event.target.value;
    this.setState({ keyword });
    this.props.getSearchResults(keyword, { immediate: !keyword.length });
  }

  cleanResults() {
    this.setState({ keyword: '' });
    this.props.getSearchResults('', { immediate: true });
  }

  render() {
    const isSearching = this.props.search.count || this.state.keyword.length > this.defaults.characterLimit;

    let searchResults;
    if (this.props.search.count && this.state.keyword.length >= this.defaults.characterLimit) {
      searchResults = [];
      for (let i = 0, length = this.props.search.entries.length; i < length; i++) {
        searchResults.push(
          <SearchResult
            className={searchPanelStyles.result}
            key={i}
            keyword={this.state.keyword}
            drawVessel={this.props.drawVessel}
            vesselInfo={this.props.search.entries[i]}
            toggleVisibility={this.props.toggleVisibility}
            vesselVisibility={this.props.vesselVisibility}
          />
        );
      }
    } else if (this.state.keyword.length < this.defaults.characterLimit) {
      searchResults = (
        <li className={searchPanelStyles.result}>
          Type at least {this.defaults.characterLimit} characters
        </li>);
    } else {
      searchResults = <li className={searchPanelStyles.result}>No result</li>;
    }

    return (
      <div className={searchPanelStyles['c-search-panel']}>
        <input
          type="text"
          onChange={(e) => this.onSearchInputChange(e)}
          className={searchPanelStyles['search-accordion']}
          placeholder="Type your search criteria"
          value={this.state.keyword}
          ref={ref => (this.searchField = ref)}
        />
      {!isSearching &&
        <svg
          className={classnames(iconsStyles.icon, 'icon-search')}
        >
          <use xlinkHref="#icon-search"></use>
        </svg>}

      {!!isSearching &&
        <CloseIcon
          className={classnames(iconsStyles.icon, 'icon-close')}
          onClick={() => this.cleanResults()}
        />}
        <ul
          className={classnames(searchPanelStyles['result-list'], searchPanelStyles['-open'])}
        >
          {searchResults}
        </ul>
      </div>);
  }
}

SearchPanel.propTypes = {
  drawVessel: React.PropTypes.func,
  getSearchResults: React.PropTypes.func,
  search: React.PropTypes.object,
  toggleVisibility: React.PropTypes.func,
  vesselVisibility: React.PropTypes.bool,
  // Whether the search panel is expanded or closed
  visible: React.PropTypes.bool
};


export default SearchPanel;
