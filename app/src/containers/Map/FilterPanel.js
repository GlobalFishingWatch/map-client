import { connect } from 'react-redux';
import FilterPanel from 'components/Map/FilterPanel';
import { setFlagFilters } from 'actions/filters';


const mapStateToProps = (state) => ({
  flags: state.filters.flags
});

const mapDispatchToProps = (dispatch) => ({
  setFlagFilters: flag => {
    dispatch(setFlagFilters(flag));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
