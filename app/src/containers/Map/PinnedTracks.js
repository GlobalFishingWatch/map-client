import { connect } from 'react-redux';
import PinnedTracks from 'components/Map/PinnedTracks';
import { setSearchEditMode } from 'actions/map';
import { showPinnedVesselDetails, toggleVesselPin, setPinnedVesselHue } from 'actions/vesselInfo';

const mapStateToProps = state => ({
  editMode: state.map.searchEditMode.open,
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = dispatch => ({
  onVesselClicked: (seriesgroup) => {
    dispatch(showPinnedVesselDetails(seriesgroup));
  },
  onRemoveClicked: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup));
  },
  toggleEditMode: (visibility) => {
    dispatch(setSearchEditMode(visibility));
  },
  setPinnedVesselHue: (seriesgroup, hue) => {
    dispatch(setPinnedVesselHue(seriesgroup, hue));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PinnedTracks);
