import { connect } from 'react-redux'
import SearchPanel from 'app/search/components/SearchPanel'
import {
  setSearchTerm,
  setSearchModalVisibility,
  setSearchResultVisibility,
} from 'app/search/searchActions'

const mapStateToProps = (state) => ({
  entries: state.search.entries,
  totalResults: state.search.totalResults,
  searching: state.search.searching,
  searchTerm: state.search.searchTerm,
  searchModalOpen: state.search.searchModalOpen,
  searchResultsOpen: state.search.searchResultsOpen,
  hasHiddenSearchableLayers: state.search.hasHiddenSearchableLayers,
})

const mapDispatchToProps = (dispatch) => ({
  setSearchTerm: (searchTerm) => {
    dispatch(setSearchTerm(searchTerm))
  },
  openSearchModal: () => {
    dispatch(setSearchModalVisibility(true))
  },
  setSearchResultsVisibility: (visibility) => {
    dispatch(setSearchResultVisibility(visibility))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPanel)
