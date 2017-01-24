import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { setPinnedVesselEditMode } from 'actions/map';
import { login } from 'actions/user';

const mapStateToProps = state => ({
  layers: state.layers,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  closeSearchEditMode: () => {
    dispatch(setPinnedVesselEditMode(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
