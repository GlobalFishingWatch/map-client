import { connect } from 'react-redux';
import VesselInfoPanel from 'components/Map/VesselInfoPanel';
import { clearVesselInfo, toggleActiveVesselPin, setRecentVesselHistory } from 'actions/vesselInfo';
import { login } from 'actions/user';

const mapStateToProps = state => ({
  vessels: state.vesselInfo.vessels,
  infoPanelStatus: state.vesselInfo.infoPanelStatus,
  userPermissions: state.user.userPermissions
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  hide: () => {
    dispatch(clearVesselInfo());
  },
  onTogglePin: (seriesgroup) => {
    dispatch(toggleActiveVesselPin());
    dispatch(setRecentVesselHistory(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
