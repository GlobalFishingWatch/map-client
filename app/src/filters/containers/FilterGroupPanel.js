import { connect } from 'react-redux';
import FilterGroupPanel from 'filters/components/FilterGroupPanel';
import { setFilterGroupModalVisibility } from 'filters/filtersActions';


const mapStateToProps = state => ({
  filterGroups: state.filters.filterGroups
});

const mapDispatchToProps = dispatch => ({
  createFilterGroup: () => {
    dispatch(setFilterGroupModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroupPanel);
