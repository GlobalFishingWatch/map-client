import { connect } from 'react-redux';
import PinnedTracks from 'components/Map/PinnedTracks';
import { showPinnedVesselDetails, toggleVesselPin, setPinnedVesselHue } from 'actions/vesselInfo';

const mapStateToProps = (state) => ({
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = (dispatch) => ({
  onVesselClicked: (seriesgroup) => {
    dispatch(showPinnedVesselDetails(seriesgroup));
  },
  onRemoveClicked: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup));
  },
  setPinnedVesselHue(seriesgroup, hue) {
    dispatch(setPinnedVesselHue(seriesgroup, hue));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PinnedTracks);
