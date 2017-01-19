import React, { Component } from 'react';
import classnames from 'classnames';
import SearchResult from 'containers/Map/SearchResult';
import PinnedTracks from 'containers/Map/PinnedTracks';

import iconsStyles from 'styles/icons.scss';
import searchPanelStyles from 'styles/components/map/c-search-panel.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';

import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=CloseIcon';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.defaults = {
      characterLimit: 3,
      resultsLimit: 4
    };

    this.state = {
      keyword: '', searching: false
    };
  }

  componentWillReceiveProps() {
    this.setState({ searching: false });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.searchField.focus();
    }
  }

  onSearchInputChange(event) {
    const keyword = event.target.value;

    this.setState({ keyword, searching: keyword.length >= this.defaults.characterLimit });
    this.props.getSearchResults(keyword, { immediate: !keyword.length });
  }

  onBlur() {
    document.querySelector('body').style.height = '100%';
  }

  setBodyHeight() {
    document.querySelector('body').style.height = `${window.innerHeight}px`;
  }

  cleanResults() {
    this.setState({ keyword: '' });
    this.props.getSearchResults('', { immediate: true });
  }

  render() {
    let searchResults = null;

    if (this.state.searching) {
      searchResults = <li className={searchPanelStyles['search-message']}>Searching...</li>;
    } else if (this.props.search.count && this.state.keyword.length >= this.defaults.characterLimit) {
      searchResults = [];
      for (let i = 0, length = this.defaults.resultsLimit; i < length; i++) {
        searchResults.push(<SearchResult
          className={searchPanelStyles.result}
          key={i}
          keyword={this.state.keyword}
          vesselInfo={this.props.search.entries[i]}
        />);
      }
    } else if (this.state.keyword.length < this.defaults.characterLimit && this.state.keyword.length > 0) {
      searchResults = (
        <li className={searchPanelStyles['search-message']}>
          Type at least {this.defaults.characterLimit} characters
        </li>);
    } else {
      searchResults = <li className={searchPanelStyles['search-message']}>No result</li>;
    }

    return (
      <div className={searchPanelStyles['c-search-panel']}>
        <input
          type="text"
          onBlur={this.onBlur}
          onChange={(e) => this.onSearchInputChange(e)}
          onFocus={this.setBodyHeight}
          className={searchPanelStyles['search-accordion']}
          placeholder="Search vessel"
          value={this.state.keyword}
          ref={ref => (this.searchField = ref)}
        />
        {this.state.keyword.length > 0 && <CloseIcon
          className={classnames(iconsStyles.icon, iconsStyles['icon-close'], searchPanelStyles['clean-query-button'])}
          onClick={() => this.cleanResults()}
        />}
        <div
          className={classnames(searchPanelStyles['results-container'],
            { [`${searchPanelStyles['-open']}`]: this.state.keyword.length })}
        >
          <ul
            className={classnames(searchPanelStyles['result-list'])}
          >
            {searchResults}
          </ul>
          {this.state.keyword.length >= this.defaults.characterLimit &&
            !this.state.searching && this.props.search.count > this.defaults.resultsLimit &&
            <div className={searchPanelStyles['pagination-container']}>
              <button
                className={classnames(MapButtonStyles['c-button'], MapButtonStyles['-filled'], searchPanelStyles['more-results-button'])}
              >
                more results
              </button>
            </div>}
        </div>
        <PinnedTracks />
      </div>);
  }
}

SearchPanel.propTypes = {
  search: React.PropTypes.object,
  visible: React.PropTypes.bool,
  getSearchResults: React.PropTypes.func
};

export default SearchPanel;
