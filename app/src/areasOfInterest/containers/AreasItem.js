import { connect } from 'react-redux';
import AreasItem from 'areasOfInterest/components/AreasItem';
import { toggleAreaVisibility, deleteArea } from 'areasOfInterest/areasOfInterestActions';

const mapStateToProps = state => ({
  recentlyCreated: state.areas.recentlyCreated
});

const mapDispatchToProps = dispatch => ({
  toggleAreaVisibility: (areaIndex) => {
    dispatch(toggleAreaVisibility(areaIndex));
  },
  deleteArea: (areaIndex) => {
    dispatch(deleteArea(areaIndex));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasItem);
