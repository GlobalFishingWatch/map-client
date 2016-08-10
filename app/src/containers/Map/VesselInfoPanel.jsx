import { connect } from 'react-redux';
import VesselInfoPanel from '../../components/Map/VesselInfoPanel';
import { changeVesselTrackDisplayMode } from '../../actions/map';

const mapStateToProps = (state) => ({
  vesselTrackDisplayMode: state.map.vesselTrackDisplayMode,
  vesselInfo: state.vesselInfo.details
});

const mapDispatchToProps = dispatch => ({
  changeVesselTrackDisplayMode: vesselTrackDisplayMode => {
    dispatch(changeVesselTrackDisplayMode(vesselTrackDisplayMode));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
