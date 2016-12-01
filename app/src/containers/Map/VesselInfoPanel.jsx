import { connect } from 'react-redux';
import VesselInfoPanel from '../../components/Map/VesselInfoPanel';
import { toggleVisibility } from '../../actions/vesselInfo';

const mapStateToProps = (state) => ({
  vesselInfo: state.vesselInfo.details, vesselVisibility: state.vesselInfo.vesselVisibility
});

const mapDispatchToProps = dispatch => ({
  toggleVisibility: (visibility) => {
    dispatch(toggleVisibility(visibility));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
