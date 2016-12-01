import { connect } from 'react-redux';
import FilterPanel from '../../components/Map/FilterPanel';
import { setFlagFilter } from '../../actions/filters';


const mapStateToProps = (state) => ({
  filters: state.filters
});

const mapDispatchToProps = (dispatch) => ({
  setFlagFilter: filters => {
    dispatch(setFlagFilter(filters));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
