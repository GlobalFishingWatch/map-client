import { connect } from 'react-redux';
import ControlPanel from '../../components/Map/ControlPanel';
import { updateVesselTransparency, updateVesselColor } from '../../actions/map';


const mapStateToProps = (state) => ({
  layers: state.layers,
  vesselTransparency: state.map.vesselTransparency,
  vesselColor: state.map.vesselColor
});

const mapDispatchToProps = (dispatch) => ({
  updateVesselTransparency: (visible) => {
    dispatch(updateVesselTransparency(visible));
  },
  updateVesselColor: (visible) => {
    dispatch(updateVesselColor(visible));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
