import { connect } from 'react-redux';
import SearchResult from 'components/Map/SearchResult';
import { addVessel, clearVesselInfo } from 'actions/vesselInfo';
import { toggleLayerVisibility } from 'actions/layers';

const mapStateToProps = state => ({
  searchTerm: state.search.searchTerm
});

const mapDispatchToProps = dispatch => ({
  drawVessel: (vesselDetails) => {
    dispatch(toggleLayerVisibility(vesselDetails.tilesetId, true));
    dispatch(clearVesselInfo());
    dispatch(addVessel(vesselDetails.tilesetId, vesselDetails.seriesgroup, null, true, true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
