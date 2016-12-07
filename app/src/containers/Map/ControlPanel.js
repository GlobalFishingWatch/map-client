import { connect } from 'react-redux';
import ControlPanel from 'components/Map/ControlPanel';
import { updateVesselTransparency, updateVesselColor } from 'actions/map';
import { toggleVisibility } from 'actions/vesselInfo';


const mapStateToProps = (state) => ({
  layers: state.layers,
  vesselTransparency: state.map.vesselTransparency,
  vesselColor: state.map.vesselColor,
  vesselVisibility: state.vesselInfo.vesselVisibility
});

const mapDispatchToProps = (dispatch) => ({
  updateVesselTransparency: (visible) => {
    dispatch(updateVesselTransparency(visible));
  },
  updateVesselColor: (visible) => {
    dispatch(updateVesselColor(visible));
  },
  toggleVisibility: (visibility) => {
    dispatch(toggleVisibility(visibility));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
