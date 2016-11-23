import { connect } from 'react-redux';
import VesselInfoPanel from '../../components/Map/VesselInfoPanel';

const mapStateToProps = (state) => ({
  vesselInfo: state.vesselInfo.details,
  vesselVisibility: state.vesselInfo.vesselVisibility
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VesselInfoPanel);
