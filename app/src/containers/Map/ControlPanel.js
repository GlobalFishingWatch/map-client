import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { setSearchResulVisibility } from 'actions/search';
import { togglePinnedVesselEditMode } from 'actions/vesselInfo';
import { login } from 'actions/user';

const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  userPermissions: state.user.userPermissions,
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  disableSearchEditMode: () => {
    dispatch(togglePinnedVesselEditMode(false));
  },
  hideSearchResults: () => {
    dispatch(setSearchResulVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
