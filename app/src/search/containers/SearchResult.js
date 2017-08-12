import { connect } from 'react-redux';
import SearchResult from 'search/components/SearchResult';
import { addVessel, clearVesselInfo } from 'actions/vesselInfo';
import { toggleLayerVisibility } from 'layers/layersActions';

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
