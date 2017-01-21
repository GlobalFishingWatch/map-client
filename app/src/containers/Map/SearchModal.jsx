import { connect } from 'react-redux';
import SearchModal from 'components/Map/SearchModal';
import { setSearchTerm, setSearchModalVisibility, setSearchPage } from 'actions/search';

const mapStateToProps = (state) => ({
  entries: state.search.entries,
  count: state.search.count,
  searching: state.search.searching,
  searchTerm: state.search.searchTerm
});

const mapDispatchToProps = (dispatch) => ({
  setSearchPage: (page) => {
    dispatch(setSearchPage(page));
  },
  setSearchTerm: (searchTerm) => {
    dispatch(setSearchPage(0));
    dispatch(setSearchTerm(searchTerm));
  },
  closeSearchModal: () => {
    dispatch(setSearchModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
