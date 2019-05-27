import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import SearchResult from 'app/search/containers/SearchResult'
import PaginatorStyles from 'styles/components/shared/paginator.module.scss'
import ReactPaginate from 'react-paginate'
import { SEARCH_QUERY_MINIMUM_LIMIT } from 'app/config'
import ModalStyles from 'styles/components/shared/modal.module.scss'
import ResultListStyles from 'styles/search/result-list.module.scss'
import SearchModalStyles from 'styles/components/map/search-modal.module.scss'
import iconsStyles from 'styles/icons.module.scss'
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { ReactComponent as ArrowBoxIcon } from 'assets/icons/arrow-box.svg'
import Modal from 'app/components/Shared/Modal'

class SearchModal extends Component {
  onSearchInputChange(value) {
    this.props.setSearchTerm(value)
  }

  onPageChange(page) {
    this.props.setSearchPage(page)
  }

  cleanResults() {
    this.props.setSearchTerm('')
  }

  renderSearchingMessage() {
    return <li className={ResultListStyles.statusMessage}>Searching...</li>
  }

  renderShortSearchWordMessage() {
    return (
      <li className={ResultListStyles.statusMessage}>
        Type at least {SEARCH_QUERY_MINIMUM_LIMIT} characters
      </li>
    )
  }

  renderNoResultMessage() {
    return <li className={ResultListStyles.statusMessage}>No result</li>
  }

  renderSearchResults() {
    return this.props.entries.map((entry, index) => (
      <SearchResult
        className={classnames(ResultListStyles.resultItem, ResultListStyles.modalResult)}
        key={index}
        closeSearch={() => this.props.close()}
        vesselInfo={entry}
      />
    ))
  }

  renderMainContent() {
    let searchResults

    if (this.props.searching) {
      searchResults = this.renderSearchingMessage()
    } else if (this.props.pageCount && this.props.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT) {
      searchResults = this.renderSearchResults()
    } else if (
      this.props.searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT &&
      this.props.searchTerm.length > 0
    ) {
      searchResults = this.renderShortSearchWordMessage()
    } else {
      searchResults = this.renderNoResultMessage()
    }

    return (
      <div>
        <h3 className={ModalStyles.modalTitle}>Search vessel</h3>
        <div className={SearchModalStyles.searchContainer}>
          <div className={SearchModalStyles.searchInputContainer}>
            <input
              className={SearchModalStyles.searchInput}
              onChange={(e) => this.onSearchInputChange(e.target.value)}
              placeholder="Search vessel"
              value={this.props.searchTerm}
            />
            {this.props.searchTerm.length === 0 && (
              <SearchIcon className={classnames(iconsStyles.icon, SearchModalStyles.searchIcon)} />
            )}
            {this.props.searchTerm.length > 0 && (
              <CloseIcon
                className={classnames(
                  iconsStyles.icon,
                  iconsStyles.iconClose,
                  SearchModalStyles.deleteIcon
                )}
                onClick={() => this.cleanResults()}
              />
            )}
          </div>
          {searchResults && (
            <ul
              className={classnames(
                ResultListStyles.resultList,
                SearchModalStyles.searchResultList
              )}
            >
              {searchResults}
            </ul>
          )}
        </div>
      </div>
    )
  }

  renderFooter() {
    return (
      <div className={SearchModalStyles.paginatorContainer}>
        <div className={PaginatorStyles.paginator}>
          {!this.props.searching && this.props.entries.length > 0 && (
            <ReactPaginate
              previousLabel={<ArrowBoxIcon />}
              nextLabel={<ArrowBoxIcon />}
              nextClassName={PaginatorStyles.next}
              previousClassName={PaginatorStyles.previous}
              breakLabel={<span>...</span>}
              pageClassName={PaginatorStyles.pageItem}
              breakClassName={PaginatorStyles.pageItem}
              pageCount={this.props.pageCount}
              pageRangeDisplayed={3}
              onPageChange={(e) => this.onPageChange(e.selected)}
              forcePage={this.props.page}
              containerClassName={PaginatorStyles.pageList}
              activeClassName={PaginatorStyles._current}
              disabledClassName={PaginatorStyles._disabled}
            />
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        opened={this.props.opened}
        closeable
        isScrollable
        tallContent
        close={this.props.close}
        footer={this.renderFooter()}
      >
        {this.renderMainContent()}
      </Modal>
    )
  }
}

SearchModal.propTypes = {
  close: PropTypes.func,
  opened: PropTypes.bool,
  visible: PropTypes.bool,
  setSearchTerm: PropTypes.func,
  setSearchPage: PropTypes.func,
  /*
   Search results
   */
  entries: PropTypes.array /*
   Number of total search results
   */,
  pageCount: PropTypes.number /*
   If search is in progress
   */,
  searching: PropTypes.bool /*
   Search term to use
   */,
  searchTerm: PropTypes.string,
  page: PropTypes.number,
}

export default SearchModal
