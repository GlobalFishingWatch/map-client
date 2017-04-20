import { connect } from 'react-redux';
import SearchPanel from 'components/Map/SearchPanel';
import { setSearchTerm, setSearchModalVisibility, setSearchResulVisibility } from 'actions/search';

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
    dispatch(setSearchResulVisibility(visibility));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
