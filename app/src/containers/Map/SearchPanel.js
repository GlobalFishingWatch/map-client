import { connect } from 'react-redux';
import SearchPanel from 'components/Map/SearchPanel';
import { getSearchResults, setSearchModalVisibility } from 'actions/search';

const mapStateToProps = state => ({
  entries: state.search.entries,
  count: state.search.count,
  searching: state.search.searching,
  keyword: state.search.keyword,
  searchModalOpen: state.search.searchModalOpen
});

const mapDispatchToProps = dispatch => ({
  getSearchResults: (searchTerm) => {
    dispatch(getSearchResults(searchTerm));
  },
  openSearchModal: () => {
    dispatch(setSearchModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
