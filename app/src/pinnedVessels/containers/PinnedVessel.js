import { connect } from 'react-redux';
import PinnedVessel from 'pinnedVessels/components/PinnedVessel';

import {
  showPinnedVesselDetails,
  toggleVesselPin,
  setPinnedVesselColor,
  setPinnedVesselTitle,
  togglePinnedVesselVisibility,
  toggleActiveVesselPin
} from 'vesselInfo/vesselInfoActions';
import { addVesselToRecentVesselList } from 'recentVessels/recentVesselsActions';

const mapStateToProps = state => ({
  pinnedVesselEditMode: state.vesselInfo.pinnedVesselEditMode,
  currentlyShownVessel: state.vesselInfo.currentlyShownVessel
});

const mapDispatchToProps = dispatch => ({
  onVesselClicked: (seriesgroup, label, tilesetId) => {
    dispatch(addVesselToRecentVesselList(seriesgroup, label, tilesetId));
    dispatch(showPinnedVesselDetails(tilesetId, seriesgroup));
  },
  onRemoveClicked: (seriesgroup) => {
    dispatch(toggleVesselPin(seriesgroup));
  },
  setPinnedVesselColor(seriesgroup, color) {
    dispatch(setPinnedVesselColor(seriesgroup, color));
  },
  setPinnedVesselTitle(seriesgroup, title) {
    dispatch(setPinnedVesselTitle(seriesgroup, title));
  },
  togglePinnedVesselVisibility(seriesgroup) {
    dispatch(togglePinnedVesselVisibility(seriesgroup));
  },
  onTogglePin: (seriesgroup) => {
    dispatch(toggleActiveVesselPin(seriesgroup));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PinnedVessel);
