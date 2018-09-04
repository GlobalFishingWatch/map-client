import { connect } from 'react-redux';
import Vessel from 'vessels/components/Vessel';
import {
  togglePinnedVesselVisibility,
  showPinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselColor,
  targetVessel
} from 'vesselInfo/vesselInfoActions';
import { addVesselToRecentVesselList } from 'recentVessels/recentVesselsActions';

const mapStateToProps = state => ({
  currentlyShownVessel: state.vesselInfo.currentlyShownVessel
});

const mapDispatchToProps = dispatch => ({
  toggle(seriesgroup) {
    dispatch(togglePinnedVesselVisibility(seriesgroup));
  },
  showVesselDetails: (seriesgroup, label, tilesetId) => {
    dispatch(addVesselToRecentVesselList(seriesgroup, label, tilesetId));
    dispatch(showPinnedVesselDetails(tilesetId, seriesgroup));
  },
  delete: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup));
  },
  setColor(seriesgroup, color) {
    dispatch(setPinnedVesselColor(seriesgroup, color));
  },
  targetVessel: (seriesgroup) => {
    dispatch(targetVessel(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Vessel);
