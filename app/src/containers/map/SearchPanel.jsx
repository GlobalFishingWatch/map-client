import { connect } from 'react-redux';
import SearchPanel from '../../components/map/SearchPanel';
import { updateFilters } from '../../actions/filters';
import { getSearchResults } from '../../actions/search';
import { getVesselTrack } from '../../actions/vesselInfo';
import { RESET_VESSEL_DETAILS } from '../../constants';

const mapStateToProps = (state) => ({
  search: state.search
});

const mapDispatchToProps = (dispatch) => ({
  updateFilters: (filters) => {
    dispatch(updateFilters(filters));
  },
  getSearchResults: (searchTerm) => {
    dispatch(getSearchResults(searchTerm));
  },
  drawVessel: (vesselDetails) => {
    dispatch({
      type: RESET_VESSEL_DETAILS,
      payload: vesselDetails
    });
    dispatch(getVesselTrack(vesselDetails.seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
