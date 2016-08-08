import { connect } from 'react-redux';
import ControlPanel from '../../components/map/ControlPanel';
import { updateFilters } from '../../actions/filters';
import { toggleLayerVisibility, updateVesselTransparency } from '../../actions/map';


const mapStateToProps = (state) => ({
  layers: state.layers,
  vesselTransparency: state.map.vesselTransparency
});

const mapDispatchToProps = (dispatch) => ({
  updateFilters: () => {
    dispatch(updateFilters());
  },
  toggleLayerVisibility: () => {
    dispatch(toggleLayerVisibility());
  },
  updateVesselTransparency: (visible) => {
    dispatch(updateVesselTransparency(visible));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
