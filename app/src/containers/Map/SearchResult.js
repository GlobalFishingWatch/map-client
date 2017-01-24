import { connect } from 'react-redux';
import SearchResult from 'components/Map/SearchResult';
import { addVessel, clearVesselInfo } from 'actions/vesselInfo';

const mapStateToProps = state => ({
  searchTerm: state.search.searchTerm
});

const mapDispatchToProps = dispatch => ({
  drawVessel: (vesselDetails) => {
    dispatch(clearVesselInfo());
    dispatch(addVessel(vesselDetails.seriesgroup, null, true, true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
