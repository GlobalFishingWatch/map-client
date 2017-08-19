import { connect } from 'react-redux';
import { toggleFilterGroupVisibility, setEditFilterGroupIndex, setFilterGroupModalVisibility } from 'filters/filterGroupsActions';
import FilterGroupItem from 'filters/components/FilterGroupItem';

const mapDispatchToProps = dispatch => ({
  toggleFilterGroupVisibility: (index) => {
    dispatch(toggleFilterGroupVisibility(index));
  },
  editFilterGroup: (index) => {
    dispatch(setEditFilterGroupIndex(index));
    dispatch(setFilterGroupModalVisibility(true));
  }
});

export default connect(null, mapDispatchToProps)(FilterGroupItem);
