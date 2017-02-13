import { connect } from 'react-redux';
import PinnedTracksItem from 'components/Map/PinnedTracksItem';
import {
  showPinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselHue,
  setPinnedVesselTitle,
  setRecentVesselHistory,
  togglePinnedVesselVisibility
} from 'actions/vesselInfo';

const mapStateToProps = state => ({
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode
});

const mapDispatchToProps = dispatch => ({
  onVesselClicked: (seriesgroup) => {
    dispatch(setRecentVesselHistory(seriesgroup));
    dispatch(showPinnedVesselDetails(seriesgroup));
  },
  onRemoveClicked: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup));
  },
  setPinnedVesselHue(seriesgroup, hue) {
    dispatch(setPinnedVesselHue(seriesgroup, hue));
  },
  setPinnedVesselTitle(seriesgroup, title) {
    dispatch(setPinnedVesselTitle(seriesgroup, title));
  },
  togglePinnedVesselVisibility(seriesgroup) {
    dispatch(togglePinnedVesselVisibility(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PinnedTracksItem);
