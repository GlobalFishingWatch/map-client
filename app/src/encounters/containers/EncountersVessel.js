import { connect } from 'react-redux';
import EncountersVessel from 'encounters/components/EncountersVessel';
import { login } from 'user/userActions';
import { addVessel, clearVesselInfo } from 'vesselInfo/vesselInfoActions';
import { clearEncountersInfo } from 'encounters/encountersActions';

const mapStateToProps = state => ({
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  openVessel: (vessel) => {
    dispatch(clearVesselInfo());
    dispatch(clearEncountersInfo());
    dispatch(addVessel(vessel.tilesetId, parseInt(vessel.seriesgroup, 10)));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EncountersVessel);
