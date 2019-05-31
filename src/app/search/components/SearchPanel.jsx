import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import { SEARCH_RESULTS_LIMIT, SEARCH_QUERY_MINIMUM_LIMIT } from 'app/config'
import SearchResult from 'app/search/containers/SearchResult'
import iconsStyles from 'styles/icons.module.scss'
import searchPanelStyles from 'styles/search/search-panel.module.scss'
import ResultListStyles from 'styles/search/result-list.module.scss'
import MapButtonStyles from 'styles/components/button.module.scss'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg'

class SearchPanel extends Component {
  onSearchInputChange(event) {
    const searchTerm = event.target.value

    this.props.setSearchResultsVisibility(searchTerm.length > 0)

    this.props.setSearchTerm(searchTerm)
  }

  onSearchInputFocus() {
    this.props.setSearchResultsVisibility(this.props.searchTerm.length > 0)

    document.querySelector('body').style.height = `${window.innerHeight}px`
  }

  onSearchInputBlur() {
    document.querySelector('body').style.height = '100%'
  }

  onClick() {
    if (this.props.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT) {
      this.props.setSearchResultsVisibility(true)
    }
  }

  cleanResults() {
    this.closeSearch()
    this.props.setSearchTerm('')
  }

  closeSearch() {
    this.props.setSearchResultsVisibility(false)
  }

  onClickMoreResults() {
    this.closeSearch()
    this.props.openSearchModal()
  }

  renderSearchResults() {
    const total = Math.min(this.props.entries.length, SEARCH_RESULTS_LIMIT)

    let searchResults = null
    const hasResults =
      !this.props.searching &&
      this.props.pageCount &&
      this.props.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT
    if (hasResults) {
      for (let i = 0, length = total; i < length; i++) {
        searchResults = []
        searchResults.push(
          <SearchResult
            className={classnames(
              ResultListStyles.resultItem,
              ResultListStyles.quickSearchResult,
              searchPanelStyles.result
            )}
            key={i}
            closeSearch={() => this.closeSearch()}
            vesselInfo={this.props.entries[i]}
          />
        )
      }
      return (
        <ul className={classnames(ResultListStyles.resultList, searchPanelStyles.searchList)}>
          {searchResults}
        </ul>
      )
    }

    let content = null
    let legend = null
    console.log('TCL: SearchPanel -> renderSearchResults -> this.props', this.props)
    if (this.props.searching) {
      content = 'Searching...'
    } else if (
      this.props.searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT &&
      this.props.searchTerm.length > 0
    ) {
      content = `Type at least ${SEARCH_QUERY_MINIMUM_LIMIT} characters`
    } else {
      content = 'No results.'
      legend = this.props.hasHiddenSearchableLayers === true && (
        <span>
          {' '}
          Some layers are toggled off, you need to toggle them on to allow searching on them.
        </span>
      )
    }
    return (
      <ul className={classnames(ResultListStyles.resultList, searchPanelStyles.searchList)}>
        <li className={ResultListStyles.statusMessage}>
          {content}
          {legend}
        </li>
      </ul>
    )
  }

  render() {
    return (
      <div className={searchPanelStyles.searchPanel}>
        <input
          type="text"
          onBlur={() => this.onSearchInputBlur()}
          onChange={(e) => this.onSearchInputChange(e)}
          onFocus={() => this.onSearchInputFocus()}
          className={searchPanelStyles.searchInput}
          placeholder="Search vessel"
          value={this.props.searchTerm}
        />
        <SearchIcon
          className={classnames(
            iconsStyles.icon,
            iconsStyles.searchIcon,
            searchPanelStyles.searchIcon
          )}
        />
        {this.props.searchTerm.length > 0 && (
          <CloseIcon
            className={classnames(
              iconsStyles.icon,
              iconsStyles.iconClose,
              searchPanelStyles.cleanQueryButton
            )}
            onClick={() => this.cleanResults()}
          />
        )}
        <div
          className={classnames(searchPanelStyles.resultsContainer, {
            [`${searchPanelStyles._open}`]: this.props.searchResultsOpen,
          })}
        >
          {this.renderSearchResults()}
          {this.props.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT &&
            !this.props.searching &&
            this.props.pageCount > SEARCH_RESULTS_LIMIT && (
              <div className={searchPanelStyles.paginationContainer}>
                <button
                  className={classnames(
                    MapButtonStyles.button,
                    MapButtonStyles._wide,
                    MapButtonStyles._filled,
                    searchPanelStyles.paginationButton
                  )}
                  onClick={() => this.onClickMoreResults()}
                >
                  more results
                </button>
              </div>
            )}
        </div>
      </div>
    )
  }
}

SearchPanel.propTypes = {
  setSearchTerm: PropTypes.func,
  openSearchModal: PropTypes.func,
  setSearchResultsVisibility: PropTypes.func,
  /*
   Search results
   */
  entries: PropTypes.array,
  /*
   Number of total search results
   */
  pageCount: PropTypes.number,
  /*
   If search is in progress
   */
  searching: PropTypes.bool,
  /*
   If search modal is open
   */
  searchModalOpen: PropTypes.bool,
  /*
   If search result is open
   */
  searchResultsOpen: PropTypes.bool,
  /*
  Search term to search for
  */
  searchTerm: PropTypes.string,
  hasHiddenSearchableLayers: PropTypes.bool,
}

export default SearchPanel
