import { connect } from 'react-redux';
import AreasList from 'components/Map/AreasList';
import { toggleAreaVisibility, deleteArea } from 'actions/areas';

const mapStateToProps = state => ({
  areas: state.areas.data,
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

export default connect(mapStateToProps, mapDispatchToProps)(AreasList);
