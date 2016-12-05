import { connect } from 'react-redux';
import SearchResult from 'components/Map/SearchResult';
import { getVesselTrack, toggleVisibility, setCurrentVessel } from 'actions/vesselInfo';

const mapStateToProps = (state) => ({
  vesselVisibility: state.vesselInfo.vesselVisibility
});

const mapDispatchToProps = (dispatch) => ({
  drawVessel: (vesselDetails) => {
    dispatch(setCurrentVessel(vesselDetails.seriesgroup));
    dispatch(getVesselTrack(vesselDetails.seriesgroup, null, true));
  },
  toggleVisibility: (visibility) => {
    dispatch(toggleVisibility(visibility));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
