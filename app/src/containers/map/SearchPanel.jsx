import { connect } from 'react-redux';
import SearchPanel from '../../components/map/SearchPanel';
import { updateFilters } from '../../actions/filters';
import { getSearchResults } from '../../actions/search';

const mapStateToProps = (state) => ({
  search: state.search
});

const mapDispatchToProps = (dispatch) => ({
  updateFilters: (filters) => {
    dispatch(updateFilters(filters));
  },
  getSearchResults: (searchTerm) => {
    dispatch(getSearchResults(searchTerm));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
