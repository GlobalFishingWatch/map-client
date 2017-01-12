import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { login } from 'actions/user';

const mapStateToProps = (state) => ({
  layers: state.layers,
  userPermissions: state.user.acl
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
