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

  renderNoResultMessage(hasHiddenSearchableLayers) {
    return (
      <li className={ResultListStyles.statusMessage}>
        No results.
        {hasHiddenSearchableLayers === true && (
          <span>
            {' '}
            Some layers are toggled off, you need to toggle them on to allow searching on them.
          </span>
        )}
      </li>
    )
  }

  renderSearchResults() {
    const searchResults = []
    const total = Math.min(this.props.entries.length, SEARCH_RESULTS_LIMIT)

    for (let i = 0, length = total; i < length; i++) {
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

    return searchResults
  }

  render() {
    let searchResults = null

    if (this.props.searching) {
      searchResults = this.renderSearchingMessage()
    } else if (
      this.props.totalResults &&
      this.props.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT
    ) {
      searchResults = this.renderSearchResults()
    } else if (
      this.props.searchTerm.length < SEARCH_QUERY_MINIMUM_LIMIT &&
      this.props.searchTerm.length > 0
    ) {
      searchResults = this.renderShortSearchWordMessage()
    } else {
      searchResults = this.renderNoResultMessage(this.props.hasHiddenSearchableLayers)
    }
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
          <ul className={classnames(ResultListStyles.resultList, searchPanelStyles.searchList)}>
            {searchResults}
          </ul>
          {this.props.searchTerm.length >= SEARCH_QUERY_MINIMUM_LIMIT &&
            !this.props.searching &&
            this.props.totalResults > SEARCH_RESULTS_LIMIT && (
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
  setSearchTerm: PropTypes.func.isRequired,
  openSearchModal: PropTypes.func.isRequired,
  setSearchResultsVisibility: PropTypes.func.isRequired,
  /*
   Search results
   */
  entries: PropTypes.array.isRequired,
  /*
   Number of total search results
   */
  totalResults: PropTypes.number.isRequired,
  /*
   If search is in progress
   */
  searching: PropTypes.bool.isRequired,
  /*
   If search modal is open
   */
  searchModalOpen: PropTypes.bool.isRequired,
  /*
   If search result is open
   */
  searchResultsOpen: PropTypes.bool.isRequired,
  /*
  Search term to search for
  */
  searchTerm: PropTypes.string.isRequired,
  hasHiddenSearchableLayers: PropTypes.bool.isRequired,
}

export default SearchPanel
