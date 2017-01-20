import _ from 'lodash';
import { connect } from 'react-redux';
import SearchModal from 'components/Map/SearchModal';
import { getSearchResults, setSearchModalVisibility, setKeyword } from 'actions/search';

const mapStateToProps = (state) => ({
  keyword: state.search.keyword,
  search: state.search
});

const getSearchResultsDebounced = _.debounce((dispatch, keyword) => {
  dispatch(getSearchResults(keyword));
}, 200);

const mapDispatchToProps = (dispatch) => ({
  /**
   * Dispatch an action to search for the specified term
   * @param {string} searchTerm - keyword
   * @param {object} options - immediate: don't debounce the search
   */
  getSearchResults: (searchTerm, { immediate = false } = {}) => {
    if (immediate) {
      dispatch(getSearchResults(searchTerm));
    } else {
      getSearchResultsDebounced(dispatch, searchTerm);
    }
  },
  setKeyword: (keyword) => {
    dispatch(setKeyword(keyword));
  },
  closeSearchModal: () => {
    dispatch(setSearchModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
