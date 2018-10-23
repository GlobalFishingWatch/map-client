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
import { targetMapVessel } from 'src/_map';

const mapStateToProps = state => ({
  currentlyShownVessel: state.vesselInfo.currentlyShownVessel
});

const mapDispatchToProps = dispatch => ({
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
