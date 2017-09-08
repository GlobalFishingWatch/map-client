import { connect } from 'react-redux';
import PinnedVesselList from 'pinnedVessels/components/PinnedVesselList';
import {
  toggleVesselPin,
  setPinnedVesselHue,
  togglePinnedVesselEditMode
} from 'actions/vesselInfo';
import { setRecentVesselsModalVisibility } from 'recentVessels/recentVesselsActions';

const mapStateToProps = state => ({
  currentlyShownVessel: state.vesselInfo.currentlyShownVessel,
  vessels: state.vesselInfo.vessels,
  loggedUser: state.user.loggedUser,
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode
});

const mapDispatchToProps = dispatch => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(PinnedVesselList);
