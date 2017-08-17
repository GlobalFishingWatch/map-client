import { connect } from 'react-redux';
import { toggleFilterGroupVisibility } from 'filters/filtersActions';
import FilterGroupItem from 'filters/components/FilterGroupItem';


const mapStateToProps = state => ({
  filterGroups: state.filters.filterGroups
});

const mapDispatchToProps = dispatch => ({
  toggleFilterGroupVisibility: (index) => {
    dispatch(toggleFilterGroupVisibility(index));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroupItem);
