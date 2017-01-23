import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { setSearchEditMode } from 'actions/map';
import { login } from 'actions/user';

const mapStateToProps = state => ({
  layers: state.layers,
  searchEditMode: state.map.searchEditMode.open,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  closeSearchEditMode: () => {
    dispatch(setSearchEditMode(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
