import { connect } from 'react-redux';
import SearchModal from 'components/Map/SearchModal';
import { setSearchTerm, setSearchModalVisibility, setSearchPage } from 'actions/search';

const mapStateToProps = state => ({
  entries: state.search.entries,
  count: state.search.count,
  page: state.search.page,
  searching: state.search.searching,
  searchTerm: state.search.searchTerm
});

const mapDispatchToProps = dispatch => ({
  setSearchPage: (page) => {
    dispatch(setSearchPage(page));
  },
  setSearchTerm: (searchTerm) => {
    dispatch(setSearchTerm(searchTerm));
  },
  closeSearchModal: () => {
    dispatch(setSearchModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
