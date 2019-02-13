import { connect } from 'react-redux';
import Vessel from 'vessels/components/Vessel';
import {
  togglePinnedVesselVisibility,
  togglePinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselColor,
  targetVessel
} from 'vesselInfo/vesselInfoActions';
import { highlightTrack } from 'tracks/tracksActions';
import { setNotification } from 'src/notifications/notificationsActions';

const mapStateToProps = state => ({
  currentlyShownVessel: state.vesselInfo.currentlyShownVessel
});

const mapDispatchToProps = dispatch => ({
  showWarning(content) {
    dispatch(setNotification({
      visible: true,
      type: 'warning',
      content
    }));
  },
  toggle(seriesgroup) {
    dispatch(togglePinnedVesselVisibility(seriesgroup));
  },
  togglePinnedVesselDetails: (seriesgroup, label, tilesetId) => {
    dispatch(togglePinnedVesselDetails(seriesgroup, label, tilesetId));
  },
  delete: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup));
  },
  setColor(seriesgroup, color) {
    dispatch(setPinnedVesselColor(seriesgroup, color));
  },
  targetVessel: (seriesgroup) => {
    dispatch(targetVessel(seriesgroup));
  },
  highlightTrack: (seriesgroup) => {
    dispatch(highlightTrack(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Vessel);
