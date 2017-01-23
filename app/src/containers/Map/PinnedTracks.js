import { connect } from 'react-redux';
import PinnedTracks from 'components/Map/PinnedTracks';
import { setSearchEditMode } from 'actions/map';
import { showPinnedVesselDetails, toggleVesselPin, setPinnedVesselHue } from 'actions/vesselInfo';

const mapStateToProps = state => ({
  vessels: state.vesselInfo.details,
  editMode: state.vesselInfo.editMode
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
