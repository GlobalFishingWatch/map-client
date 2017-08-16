import { connect } from 'react-redux';
import AreasItem from 'areasOfInterest/components/AreasItem';
import { toggleAreaVisibility, deleteArea, setEditAreaIndex } from 'areasOfInterest/areasOfInterestActions';

const mapStateToProps = state => ({
  recentlyCreated: state.areas.recentlyCreated,
  areas: state.areas.data
});

const mapDispatchToProps = dispatch => ({
  toggleAreaVisibility: (areaIndex) => {
    dispatch(toggleAreaVisibility(areaIndex));
  },
  deleteArea: (areaIndex) => {
    dispatch(deleteArea(areaIndex));
  },
  setEditAreaIndex: (index) => {
    dispatch(setEditAreaIndex(index));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasItem);
