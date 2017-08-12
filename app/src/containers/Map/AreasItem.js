import { connect } from 'react-redux';
import AreasItem from 'components/Map/AreasItem';
import { toggleAreaVisibility, deleteArea } from 'actions/areas';

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
