import { connect } from 'react-redux';
import VesselInfoPanel from '../../components/Map/VesselInfoPanel';
import { toggleVisibility } from '../../actions/vesselInfo';
import { zoomIntoVesselCenter } from '../../actions/map';

const mapStateToProps = (state) => ({
  vesselInfo: state.vesselInfo.details,
  vesselVisibility: state.vesselInfo.vesselVisibility
});

const mapDispatchToProps = dispatch => ({
  toggleVisibility: (visibility) => {
    dispatch(toggleVisibility(visibility));
  },
  zoomIntoVesselCenter: () => {
    dispatch(zoomIntoVesselCenter());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
