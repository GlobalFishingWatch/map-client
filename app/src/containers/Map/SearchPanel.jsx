import { connect } from 'react-redux';
import SearchPanel from '../../components/Map/SearchPanel';
import { updateFilters } from '../../actions/filters';
import { getSearchResults } from '../../actions/search';
import { getVesselTrack, toggleVisibility, setVesselPosition } from '../../actions/vesselInfo';
import { RESET_VESSEL_DETAILS } from '../../actions';

const mapStateToProps = (state) => ({
  search: state.search,
  vesselVisibility: state.vesselInfo.vesselVisibility
});

const mapDispatchToProps = (dispatch) => ({
  updateFilters: (filters) => {
    dispatch(updateFilters(filters));
  },
  getSearchResults: (searchTerm) => {
    dispatch(getSearchResults(searchTerm));
  },
  drawVessel: (elem, vesselDetails) => {
    dispatch({
      type: RESET_VESSEL_DETAILS,
      payload: vesselDetails
    });
    dispatch(getVesselTrack(vesselDetails.seriesgroup));
    dispatch(setVesselPosition(elem));
  },
  toggleVisibility: (visibility) => {
    dispatch(toggleVisibility(visibility));
  },
  setVesselPosition: (elem) => {
    dispatch(setVesselPosition(elem));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
