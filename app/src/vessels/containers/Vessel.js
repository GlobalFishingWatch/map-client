import { connect } from 'react-redux';
import Vessel from 'vessels/components/Vessel';
import {
  togglePinnedVesselVisibility,
  togglePinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselColor,
  targetVessel
} from 'vesselInfo/vesselInfoActions';

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
    dispatch(targetVessel(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Vessel);
