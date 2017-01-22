import { connect } from 'react-redux';
import VesselInfoPanel from 'components/Map/VesselInfoPanel';
import { clearVesselInfo, toggleActiveVesselPin } from 'actions/vesselInfo';
import { zoomIntoVesselCenter } from 'actions/map';
import { login } from 'actions/user';

const mapStateToProps = state => ({
  details: state.vesselInfo.details,
  detailsStatus: state.vesselInfo.detailsStatus,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  hide: () => {
    dispatch(clearVesselInfo());
  },
  zoomIntoVesselCenter: () => {
    dispatch(zoomIntoVesselCenter());
  },
  togglePin: () => {
    dispatch(toggleActiveVesselPin());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
