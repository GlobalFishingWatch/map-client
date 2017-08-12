import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import SearchResult from 'containers/Map/SearchResult';
import PaginatorStyles from 'styles/components/shared/paginator.scss';
import ReactPaginate from 'react-paginate';
import Rhombus from 'components/Shared/Rhombus';
import { SEARCH_QUERY_MINIMUM_LIMIT, SEARCH_MODAL_PAGE_SIZE } from 'constants';
import ModalStyles from 'styles/components/shared/modal.scss';
import ResultListStyles from 'styles/components/shared/result-list.scss';
import SearchModalStyles from 'styles/components/map/search-modal.scss';
import iconsStyles from 'styles/icons.scss';
import SearchIcon from '-!babel-loader!svg-react-loader!assets/icons/search-icon.svg?name=SearchIcon';
import CloseIcon from '-!babel-loader!svg-react-loader!assets/icons/close.svg?name=CloseIcon';

class SearchModal extends Component {

  onSearchInputChange(value) {
    this.props.setSearchTerm(value);
  }

  onPageChange(page) {
    this.props.setSearchPage(page);
  }

  cleanResults() {
    this.props.setSearchTerm('');
  }

  render() {
    let searchResults;

    if (this.props.searching) {
      searchResults = <li className={ResultListStyles.statusMessage}>Searching...</li>;
    } else if (this.props.count && this.props.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT) {
      searchResults = [];
      for (let i = 0, length = this.props.entries.length; i < length; i++) {
        searchResults.push(<SearchResult
          className={classnames(ResultListStyles.resultItem, SearchModalStyles.searchResultItem)}
          key={i}
          closeSearch={() => this.props.closeSearchModal()}
          vesselInfo={this.props.entries[i]}
        />);
      }
    } else if (this.props.searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT && this.props.searchTerm.length > 0) {
      searchResults = (
        <li className={ResultListStyles.statusMessage}>
          Type at least {SEARCH_QUERY_MINIMUM_LIMIT} characters
        </li>);
    } else {
      searchResults = <li className={ResultListStyles.statusMessage}>No result</li>;
    }

    return (
      <div>
        <h3 className={ModalStyles.modalTitle}>Search vessel</h3>
        <div className={SearchModalStyles.searchContainer}>
          <div className={SearchModalStyles.searchInputContainer}>
            <input
              className={SearchModalStyles.searchInput}
              onChange={e => this.onSearchInputChange(e.target.value)}
              placeholder="Search vessel"
              value={this.props.searchTerm}
            />
            {this.props.searchTerm.length === 0 && <SearchIcon
              className={classnames(iconsStyles.icon, SearchModalStyles.searchIcon)}
            />}
            {this.props.searchTerm.length > 0 && <CloseIcon
              className={classnames(iconsStyles.icon, iconsStyles.iconClose, SearchModalStyles.deleteIcon)}
              onClick={() => this.cleanResults()}
            />}
          </div>
          {searchResults && <ul className={classnames(ResultListStyles.resultList, SearchModalStyles.searchResultList)}>
            {searchResults}
          </ul>
          }
        </div>
        <div className={SearchModalStyles.paginatorContainer}>
          <div
            className={PaginatorStyles.paginator}
          >
            {!this.props.searching && this.props.entries.length > 0 && <ReactPaginate
              previousLabel={<Rhombus />}
              nextLabel={<Rhombus />}
              nextClassName={PaginatorStyles.next}
              previousClassName={PaginatorStyles.previous}
              breakLabel={<span>...</span>}
              pageClassName={PaginatorStyles.pageItem}
              breakClassName={PaginatorStyles.pageItem}
              pageCount={Math.ceil(this.props.count / SEARCH_MODAL_PAGE_SIZE)}
              pageRangeDisplayed={3}
              onPageChange={e => this.onPageChange(e.selected)}
              forcePage={this.props.page}
              containerClassName={PaginatorStyles.pageList}
              activeClassName={PaginatorStyles._current}
              disabledClassName={PaginatorStyles._disabled}
            />
            }
          </div>
        </div>
      </div>);
  }
}

SearchModal.propTypes = {
  closeSearchModal: PropTypes.func,
  setSearchTerm: PropTypes.func,
  setSearchPage: PropTypes.func,
  /*
   Search results
   */
  entries: PropTypes.array, /*
   Number of total search results
   */
  count: PropTypes.number, /*
   If search is in progress
   */
  searching: PropTypes.bool, /*
   Search term to use
   */
  searchTerm: PropTypes.string,
  page: PropTypes.number
};

export default SearchModal;
