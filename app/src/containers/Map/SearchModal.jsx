import { connect } from 'react-redux';
import SearchModal from 'components/Map/SearchModal';
import { getSearchResults, setSearchModalVisibility } from 'actions/search';

const mapStateToProps = (state) => ({
  entries: state.search.entries,
  count: state.search.count,
  searching: state.search.searching,
  keyword: state.search.keyword
});

const mapDispatchToProps = (dispatch) => ({
  getSearchResults: (searchTerm) => {
    dispatch(getSearchResults(searchTerm));
  },
  closeSearchModal: () => {
    dispatch(setSearchModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
