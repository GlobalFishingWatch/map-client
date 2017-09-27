import { connect } from 'react-redux';
import Areas from 'areasOfInterest/components/Areas';

const mapStateToProps = state => ({
  areas: state.areas.existingAreasOfInterest,
  map: state.map.googleMaps
});

export default connect(mapStateToProps)(Areas);
