import { connect } from 'react-redux';
import PinnedTracks from 'components/Map/PinnedTracks';
import { showPinnedVesselDetails, toggleVesselPin } from 'actions/vesselInfo';

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
  setTrackHue(/* hue */) {
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PinnedTracks);
