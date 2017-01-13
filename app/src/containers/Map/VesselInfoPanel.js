import { connect } from 'react-redux';
import VesselInfoPanel from 'components/Map/VesselInfoPanel';
import { clearVesselInfo, clearTrack } from 'actions/vesselInfo';
import { zoomIntoVesselCenter } from 'actions/map';
import { login } from 'actions/user';

const mapStateToProps = (state) => ({
  vesselInfo: state.vesselInfo.details,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  hide: () => {
    dispatch(clearTrack());
    dispatch(clearVesselInfo());
  },
  zoomIntoVesselCenter: () => {
    dispatch(zoomIntoVesselCenter());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
