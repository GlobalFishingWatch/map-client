import { connect } from 'react-redux';
import FilterGroupPanel from 'filters/components/FilterGroupPanel';
import { setFilterGroupModalVisibility, createNewFilterGroup } from 'filters/filterGroupsActions';


const mapStateToProps = state => ({
  filterGroups: state.filterGroups.filterGroups
});

const mapDispatchToProps = dispatch => ({
  createFilterGroup: () => {
    dispatch(createNewFilterGroup());
    dispatch(setFilterGroupModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroupPanel);
