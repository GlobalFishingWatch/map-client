import { connect } from 'react-redux';
import FilterPanel from 'filters/components/FilterPanel';
import { setFlagFilters } from 'filters/filtersActions';

/** @deprecated use filterGroups logic instead */
const mapStateToProps = state => ({
  flags: state.filters.flags
});

const mapDispatchToProps = dispatch => ({
  setFlagFilters: (flags) => {
    dispatch(setFlagFilters(flags));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
