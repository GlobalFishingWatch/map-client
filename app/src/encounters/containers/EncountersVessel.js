import { connect } from 'react-redux';
import EncountersVessel from 'encounters/components/EncountersVessel';
import { login } from 'user/userActions';
import { addVesselFromEncounter, clearVesselInfo } from 'vesselInfo/vesselInfoActions';
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
    dispatch(addVesselFromEncounter(vessel.tilesetId, vessel.seriesgroup));
    dispatch(clearEncountersInfo());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EncountersVessel);
