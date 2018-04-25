import { connect } from 'react-redux';
import SearchModal from 'search/components/SearchModal';
import { setSearchTerm, setSearchModalVisibility, setSearchPage } from 'search/searchActions';

const mapStateToProps = state => ({
  entries: state.search.entries,
  pageCount: state.search.pageCount,
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
