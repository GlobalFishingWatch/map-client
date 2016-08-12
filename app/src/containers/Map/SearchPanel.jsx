import { connect } from 'react-redux';
import SearchPanel from '../../components/Map/SearchPanel';
import { updateFilters } from '../../actions/filters';
import { getSearchResults, resetSearchResults } from '../../actions/search';
import { getVesselTrack } from '../../actions/vesselInfo';
import { RESET_VESSEL_DETAILS } from '../../actions';

const mapStateToProps = (state) => ({
  searchResults: state.search
});

const mapDispatchToProps = (dispatch) => ({
  updateFilters: filters => dispatch(updateFilters(filters)),
  getSearchResults: (searchTerm) => {
    dispatch(getSearchResults(searchTerm));
  },
  resetSearchResults: () => dispatch(resetSearchResults()),
  drawVessel: (vesselDetails) => {
    dispatch({
      type: RESET_VESSEL_DETAILS,
      payload: vesselDetails
    });
    dispatch(getVesselTrack(vesselDetails.seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
