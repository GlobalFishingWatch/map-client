import { connect } from 'react-redux';
import VesselInfoPanel from '../../components/map/VesselInfoPanel';

const mapStateToProps = (state) => ({
  vesselInfoDetails: state.vesselInfo.details
});

export default connect(mapStateToProps)(VesselInfoPanel);
