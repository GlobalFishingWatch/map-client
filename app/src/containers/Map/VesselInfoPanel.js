import { connect } from 'react-redux';
import VesselInfoPanel from 'components/Map/VesselInfoPanel';
import { toggleVisibility } from 'actions/vesselInfo';
import { zoomIntoVesselCenter } from 'actions/map';
import { SET_VESSEL_TRACK } from 'actions';
import { login } from 'actions/user';

const mapStateToProps = (state) => ({
  vesselInfo: state.vesselInfo.details,
  vesselVisibility: state.vesselInfo.vesselVisibility,
  userPermissions: state.user.acl
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  toggleVisibility: (visibility) => {
    if (visibility === false) {
      dispatch({
        type: SET_VESSEL_TRACK,
        payload: null
      });
    }
    dispatch(toggleVisibility(visibility));
  },
  zoomIntoVesselCenter: () => {
    dispatch(zoomIntoVesselCenter());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
