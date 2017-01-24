import { connect } from 'react-redux';
import SearchResult from 'components/Map/SearchResult';
import { addVessel, clearVesselInfo } from 'actions/vesselInfo';
import { trackSearchResultClicked } from 'actions/analytics';

const mapStateToProps = state => ({
  searchTerm: state.search.searchTerm
});

const mapDispatchToProps = dispatch => ({
  drawVessel: (vesselDetails) => {
    dispatch(clearVesselInfo());
    dispatch(trackSearchResultClicked(vesselDetails.seriesgroup));
    dispatch(addVessel(vesselDetails.seriesgroup, null, true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
