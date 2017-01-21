import React, { Component } from 'react';
import classnames from 'classnames';
import SearchResult from 'containers/Map/SearchResult';
import Paginator from 'components/Shared/Paginator';
import { SEARCH_QUERY_MINIMUM_LIMIT, SEARCH_PAGINATION_ITEM_LIMIT } from 'constants';

import ModalStyles from 'styles/components/shared/c-modal.scss';
import ResultListStyles from 'styles/components/shared/c-result-list.scss';
import SearchModalStyles from 'styles/components/map/c-search-modal.scss';
import iconsStyles from 'styles/icons.scss';

import SearchIcon from 'babel!svg-react!assets/icons/search-icon.svg?name=SearchIcon';
import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=CloseIcon';

class SearchModal extends Component {

  onSearchInputChange(value) {
    this.props.getSearchResults(value);
  }

  cleanResults() {
    this.props.getSearchResults('');
  }

  render() {
    let searchResults;

    if (this.props.searching) {
      searchResults = <li className={SearchModalStyles['status-message']}>Searching...</li>;
    } else if (this.props.count && this.props.keyword.length >= SEARCH_QUERY_MINIMUM_LIMIT) {
      searchResults = [];
      const total = this.props.count <= SEARCH_PAGINATION_ITEM_LIMIT ?
        this.props.count : SEARCH_PAGINATION_ITEM_LIMIT;

      for (let i = 0, length = total; i < length; i++) {
        searchResults.push(<SearchResult
          className={classnames(ResultListStyles['result-item'], SearchModalStyles['search-result-item'])}
          key={i}
          keyword={this.props.keyword}
          closeSearch={() => this.props.closeSearchModal()}
          vesselInfo={this.props.entries[i]}
        />);
      }
    } else if (this.props.keyword.length < SEARCH_QUERY_MINIMUM_LIMIT && this.props.keyword.length > 0) {
      searchResults = (
        <li className={SearchModalStyles['status-message']}>
          Type at least {SEARCH_QUERY_MINIMUM_LIMIT} characters
        </li>);
    } else {
      searchResults = <li className={ResultListStyles['status-message']}>No result</li>;
    }

    return (
      <div className={SearchModalStyles['c-search-modal']}>
        <h3 className={ModalStyles['modal-title']}>Search vessel</h3>
        <div className={SearchModalStyles['search-container']}>
          <div className={SearchModalStyles['search-input-container']}>
            <input
              className={SearchModalStyles['search-input']}
              onChange={(e) => this.onSearchInputChange(e.target.value)}
              placeholder="Search vessel"
              value={this.props.keyword}
            />
            {this.props.keyword.length === 0 && <SearchIcon
              className={classnames(iconsStyles.icon, SearchModalStyles['search-icon'])}
            />}
            {this.props.keyword.length > 0 && <CloseIcon
              className={classnames(iconsStyles.icon, iconsStyles['icon-close'], SearchModalStyles['delete-icon'])}
              onClick={() => this.cleanResults()}
            />}
          </div>
          {searchResults &&
            <ul className={classnames(ResultListStyles['c-result-list'], SearchModalStyles['search-result-list'])}>
              {searchResults}
            </ul>}
        </div>
        <div className={SearchModalStyles['paginator-container']}>
          <Paginator />
        </div>
      </div>);
  }
}

SearchModal.propTypes = {
  closeSearchModal: React.PropTypes.func,
  getSearchResults: React.PropTypes.func,
  setKeyword: React.PropTypes.func,
  /*
   Search results
   */
  entries: React.PropTypes.array,
  /*
   Number of total search results
   */
  count: React.PropTypes.number,
  /*
   If search is in progress
   */
  searching: React.PropTypes.bool,
  /*
   Keyword to search for
   */
  keyword: React.PropTypes.string
};

export default SearchModal;
