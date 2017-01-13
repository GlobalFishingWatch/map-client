import _ from 'lodash';
import { connect } from 'react-redux';
import SearchPanel from 'components/Map/SearchPanel';
import { getSearchResults } from 'actions/search';
import { getVesselTrack, setCurrentVessel } from 'actions/vesselInfo';

const mapStateToProps = (state) => ({
  search: state.search
});

const getSearchResultsDebounced = _.debounce((dispatch, keyword) => {
  dispatch(getSearchResults(keyword));
}, 200);

const mapDispatchToProps = (dispatch) => ({
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

  drawVessel: (vesselDetails) => {
    dispatch(setCurrentVessel(vesselDetails.seriesgroup));
    dispatch(getVesselTrack(vesselDetails.seriesgroup, null, true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPanel);
