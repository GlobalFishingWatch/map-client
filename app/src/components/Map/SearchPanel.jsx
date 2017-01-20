import React, { Component } from 'react';
import classnames from 'classnames';
import { SEARCH_RESULTS_LIMIT, SEARCH_RESULT_CHARACTER_LIMIT } from 'constants';
import SearchResult from 'containers/Map/SearchResult';
import iconsStyles from 'styles/icons.scss';
import searchPanelStyles from 'styles/components/map/c-search-panel.scss';
import ResultListStyles from 'styles/components/shared/c-result-list.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';

import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=CloseIcon';

class SearchPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      open: false,
      searching: false
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

    this.setState({
      keyword,
      searching: keyword.length >= SEARCH_RESULT_CHARACTER_LIMIT,
      open: keyword.length > 0
    });

    this.props.setKeyword(keyword);
    this.props.getSearchResults(keyword, { immediate: !keyword.length });
  }

  onBlur() {
    document.querySelector('body').style.height = '100%';
  }

  onClick() {
    if (this.state.keyword.length >= SEARCH_RESULT_CHARACTER_LIMIT) {
      this.setState({
        open: true
      });
    }
  }

  onFocus() {
    document.querySelector('body').style.height = `${window.innerHeight}px`;
  }

  cleanResults() {
    this.setState({ keyword: '' });
    this.closeSearch();
    this.props.getSearchResults('', { immediate: true });
  }

  closeSearch() {
    this.setState({ open: false });
  }

  onClickMoreResults() {
    this.closeSearch();
    this.props.openSearchModal();
  }

  render() {
    let searchResults = null;

    if (this.state.searching) {
      searchResults = <li className={ResultListStyles['status-message']}>Searching...</li>;
    } else if (this.props.search.count && this.state.keyword.length >= SEARCH_RESULT_CHARACTER_LIMIT) {
      searchResults = [];
      const total = this.props.search.count <= SEARCH_RESULTS_LIMIT ?
        this.props.search.count : SEARCH_RESULTS_LIMIT;

      for (let i = 0, length = total; i < length; i++) {
        searchResults.push(<SearchResult
          className={classnames(ResultListStyles['result-item'], searchPanelStyles.result)}
          key={i}
          keyword={this.state.keyword}
          closeSearch={() => this.closeSearch()}
          vesselInfo={this.props.search.entries[i]}
        />);
      }
    } else if (this.state.keyword.length < SEARCH_RESULT_CHARACTER_LIMIT && this.state.keyword.length > 0) {
      searchResults = (
        <li className={ResultListStyles['status-message']}>
          Type at least {SEARCH_RESULT_CHARACTER_LIMIT} characters
        </li>);
    } else {
      searchResults = <li className={ResultListStyles['status-message']}>No result</li>;
    }

    return (
      <div className={searchPanelStyles['c-search-panel']}>
        <input
          type="text"
          onBlur={this.onBlur}
          onChange={e => this.onSearchInputChange(e)}
          onClick={() => this.onClick()}
          onFocus={() => this.onFocus()}
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
            { [`${searchPanelStyles['-open']}`]: this.state.open })}
        >
          <ul
            className={classnames(ResultListStyles['c-result-list'], searchPanelStyles['search-list'])}
          >
            {searchResults}
          </ul>
          {this.state.keyword.length >= SEARCH_RESULT_CHARACTER_LIMIT &&
            !this.state.searching && this.props.search.count > SEARCH_RESULTS_LIMIT &&
            <div className={searchPanelStyles['pagination-container']}>
              <button
                className={classnames(MapButtonStyles['c-button'], MapButtonStyles['-filled'], searchPanelStyles['more-results-button'])}
                onClick={() => this.onClickMoreResults()}
              >
                more results
              </button>
            </div>}
        </div>
      </div>);
  }
}

SearchPanel.propTypes = {
  search: React.PropTypes.object,
  visible: React.PropTypes.bool,
  getSearchResults: React.PropTypes.func,
  openSearchModal: React.PropTypes.func,
  setKeyword: React.PropTypes.func
};

export default SearchPanel;
