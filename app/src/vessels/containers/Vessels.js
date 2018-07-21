import { connect } from 'react-redux';
import Vessels from 'vessels/components/Vessels';
import { setRecentVesselsModalVisibility } from 'recentVessels/recentVesselsActions';
import { createFleet } from 'fleets/fleetsActions';

const mapStateToProps = state => ({
  loggedUser: state.user.loggedUser,
  vessels: state.vesselInfo.vessels,
  fleets: state.fleets.fleets
});

const mapDispatchToProps = dispatch => ({
  openRecentVesselModal: () => {
    dispatch(setRecentVesselsModalVisibility(true));
  },
  createFleet: () => {
    dispatch(createFleet());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Vessels);
