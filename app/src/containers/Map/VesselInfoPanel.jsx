import { connect } from 'react-redux';
import VesselInfoPanel from '../../components/Map/VesselInfoPanel';
import { toggleVisibility } from '../../actions/vesselInfo';
import { zoomIntoVesselCenter } from '../../actions/map';
import { RESET_VESSEL_TRACK } from '../../actions';


const mapStateToProps = (state) => ({
  vesselInfo: state.vesselInfo.details,
  vesselVisibility: state.vesselInfo.vesselVisibility
});

const mapDispatchToProps = dispatch => ({
  toggleVisibility: (visibility) => {
    if (visibility === false) {
      dispatch({
        type: RESET_VESSEL_TRACK
      });
    }
    dispatch(toggleVisibility(visibility));
  },
  zoomIntoVesselCenter: () => {
    dispatch(zoomIntoVesselCenter());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
