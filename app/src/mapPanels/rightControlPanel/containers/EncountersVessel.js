import { connect } from 'react-redux';
import EncountersVessel from 'mapPanels/rightControlPanel/components/EncountersVessel';
import { login } from 'user/userActions';

const mapStateToProps = state => ({
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EncountersVessel);
