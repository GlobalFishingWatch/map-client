import { connect } from 'react-redux';
import SearchResult from 'components/Map/SearchResult';
import { addVessel, clearVesselInfo } from 'actions/vesselInfo';

const mapDispatchToProps = dispatch => ({
  drawVessel: (vesselDetails) => {
    dispatch(clearVesselInfo());
    dispatch(addVessel(vesselDetails.seriesgroup, null, true));
  }
});

export default connect(null, mapDispatchToProps)(SearchResult);
