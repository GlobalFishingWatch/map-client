import { connect } from 'react-redux';
import PinnedTracks from 'components/Map/PinnedTracks';
import {
  showPinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselHue,
  togglePinnedVesselEditMode
} from 'actions/vesselInfo';
import { setRecentVesselsModalVisibility } from 'actions/map';

const mapStateToProps = state => ({
  vessels: state.vesselInfo.details,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode
});

const mapDispatchToProps = dispatch => ({
  onVesselClicked: (seriesgroup) => {
    dispatch(showPinnedVesselDetails(seriesgroup));
  },
  onRemoveClicked: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup));
  },
  togglePinnedVesselEditMode: () => {
    dispatch(togglePinnedVesselEditMode());
  },
  openRecentVesselModal: () => {
    dispatch(setRecentVesselsModalVisibility(true));
  },
  setPinnedVesselHue: (seriesgroup, hue) => {
    dispatch(setPinnedVesselHue(seriesgroup, hue));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PinnedTracks);
