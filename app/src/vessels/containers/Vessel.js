import { connect } from 'react-redux';
import Vessel from 'vessels/components/Vessel';
import {
  togglePinnedVesselVisibility,
  togglePinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselColor,
  highlightTrack
} from 'vesselInfo/vesselInfoActions';
import { fitTimelineToTrack } from 'filters/filtersActions';
import { targetMapVessel } from '@globalfishingwatch/map-components/components/map';
import { setNotification } from 'src/notifications/notificationsActions';

const mapStateToProps = state => ({
  warningLiteral: state.literals.vessel_warning,
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
    const timelineBounds = targetMapVessel(seriesgroup);
    dispatch(fitTimelineToTrack(timelineBounds));
  },
  highlightTrack: (seriesgroup) => {
    dispatch(highlightTrack(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Vessel);
