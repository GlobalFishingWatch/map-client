import _ from 'lodash';
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

const getSearchResultsDebounced = _.debounce((dispatch, keyword) => {
  dispatch(getSearchResults(keyword));
}, 200);

const mapDispatchToProps = (dispatch) => ({
  updateFilters: (filters) => {
    dispatch(updateFilters(filters));
  },

  /**
   * Dispatch an action to search for the specified term
   * @param {string} searchTerm - keyword
   * @param {object} options - immediate: don't debounce the search
   */
  getSearchResults: (searchTerm, { immediate = false } = {}) => {
    if (immediate) {
      dispatch(getSearchResults(searchTerm));
    } else {
      getSearchResultsDebounced(dispatch, searchTerm);
    }
  },

  drawVessel: (elem, vesselDetails) => {
    dispatch({
      type: RESET_VESSEL_DETAILS,
      payload: vesselDetails
    });
    dispatch(getVesselTrack(vesselDetails.seriesgroup, null, true));
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
