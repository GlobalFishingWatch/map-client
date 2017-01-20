import React, { Component } from 'react';
import classnames from 'classnames';
import SearchResult from 'components/Map/SearchResult';
import Paginator from 'components/Shared/Paginator';
import { SEARCH_RESULT_CHARACTER_LIMIT, SEARCH_PAGINATION_ITEM_LIMIT } from 'constants';

import ModalStyles from 'styles/components/shared/c-modal.scss';
import ResultListStyles from 'styles/components/shared/c-result-list.scss';
import SearchModalStyles from 'styles/components/map/c-search-modal.scss';
import iconsStyles from 'styles/icons.scss';

import SearchIcon from 'babel!svg-react!assets/icons/search-icon.svg?name=SearchIcon';
import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=CloseIcon';

class SearchModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searching: false,
      keyword: this.props.keyword || ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      keyword: nextProps.keyword,
      searching: false
    });
  }

  onSearchInputChange(value) {
    const keyword = value;

    this.setState({
      keyword,
      searching: keyword.length >= SEARCH_RESULT_CHARACTER_LIMIT,
      open: keyword.length > 0
    });

    this.props.setKeyword(keyword);
    this.props.getSearchResults(keyword, { immediate: !keyword.length });
  }

  cleanResults() {
    this.setState({ keyword: '' });
    this.props.getSearchResults('', { immediate: true });
  }

  render() {
    let searchResults;

    if (this.state.searching) {
      searchResults = <li className={SearchModalStyles['status-message']}>Searching...</li>;
    } else if (this.props.search.count && this.state.keyword.length >= SEARCH_RESULT_CHARACTER_LIMIT) {
      searchResults = [];
      const total = this.props.search.count <= SEARCH_PAGINATION_ITEM_LIMIT ?
        this.props.search.count : SEARCH_PAGINATION_ITEM_LIMIT;

      for (let i = 0, length = total; i < length; i++) {
        searchResults.push(<SearchResult
          className={classnames(ResultListStyles['result-item'], SearchModalStyles['search-result-item'])}
          key={i}
          keyword={this.state.keyword}
          closeSearch={() => this.props.closeModal()}
          vesselInfo={this.props.search.entries[i]}
        />);
      }
    } else if (this.props.keyword.length < SEARCH_RESULT_CHARACTER_LIMIT && this.state.keyword.length > 0) {
      searchResults = (
        <li className={SearchModalStyles['status-message']}>
          Type at least {SEARCH_RESULT_CHARACTER_LIMIT} characters
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
              value={this.state.keyword}
            />
            {this.state.keyword.length === 0 && <SearchIcon
              className={classnames(iconsStyles.icon, SearchModalStyles['search-icon'])}
            />}
            {this.state.keyword.length > 0 && <CloseIcon
              className={classnames(iconsStyles.icon, iconsStyles['icon-close'], SearchModalStyles['delete-icon'])}
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
  closeModal: React.PropTypes.func,
  getSearchResults: React.PropTypes.func,
  setKeyword: React.PropTypes.func,
  keyword: React.PropTypes.string,
  search: React.PropTypes.object
};

export default SearchModal;
