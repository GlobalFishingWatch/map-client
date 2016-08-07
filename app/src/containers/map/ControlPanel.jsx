import { connect } from 'react-redux';
import ControlPanel from '../../components/map/ControlPanel';
import { updateVesselTransparency } from '../../actions/map';


const mapStateToProps = (state) => ({
  layers: state.layers,
  vesselTransparency: state.map.vesselTransparency
});

const mapDispatchToProps = (dispatch) => ({
  updateVesselTransparency: (visible) => {
    dispatch(updateVesselTransparency(visible));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
