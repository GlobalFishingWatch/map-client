import { connect } from 'react-redux';
import PinnedTracksItem from 'components/Map/PinnedTracksItem';
import {
  showPinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselHue,
  setPinnedVesselTitle,
  togglePinnedVesselVisibility
} from 'actions/vesselInfo';
import { addVesselToRecentVesselList } from 'recentVessels/recentVesselsActions';

const mapStateToProps = state => ({
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode
});

const mapDispatchToProps = dispatch => ({
  onVesselClicked: (tilesetId, seriesgroup) => {
    dispatch(addVesselToRecentVesselList(seriesgroup));
    dispatch(showPinnedVesselDetails(tilesetId, seriesgroup));
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
