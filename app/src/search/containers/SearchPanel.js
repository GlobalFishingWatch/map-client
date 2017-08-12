import { connect } from 'react-redux';
import SearchPanel from 'search/components/SearchPanel';
import { setSearchTerm, setSearchModalVisibility, setSearchResultVisibility } from 'search/searchActions';

const mapStateToProps = state => ({
  entries: state.search.entries,
  count: state.search.count,
  searching: state.search.searching,
  searchTerm: state.search.searchTerm,
  searchModalOpen: state.search.searchModalOpen,
  searchResultsOpen: state.search.searchResultsOpen,
  searchLayerId: state.map.tilesetId
});

const mapDispatchToProps = dispatch => ({
  setSearchTerm: (searchTerm) => {
    dispatch(setSearchTerm(searchTerm));
  },
  openSearchModal: () => {
    dispatch(setSearchModalVisibility(true));
  },
  setSearchResultsVisibility: (visibility) => {
    dispatch(setSearchResultVisibility(visibility));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
