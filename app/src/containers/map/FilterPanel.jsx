import { connect } from 'react-redux';
import FilterPanel from '../../components/map/FilterPanel';
import { updateFilters } from '../../actions/filters';


const mapStateToProps = (state) => ({
  filters: state.filters
});

const mapDispatchToProps = (dispatch) => ({
  updateFilters: filters => {
    dispatch(updateFilters(filters));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
