import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { login } from 'actions/user';

const mapStateToProps = (state) => ({
  layers: state.layers,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
