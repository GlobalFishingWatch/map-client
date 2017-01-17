import { connect } from 'react-redux';
import PinnedTracks from 'components/Map/PinnedTracks';
import { showPinnedVesselDetails } from 'actions/vesselInfo';

const mapStateToProps = (state) => ({
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = (dispatch) => ({
  onVesselClicked: (seriesgroup) => {
    dispatch(showPinnedVesselDetails(seriesgroup));
  },
  setTrackHue(/* hue */) {
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PinnedTracks);
