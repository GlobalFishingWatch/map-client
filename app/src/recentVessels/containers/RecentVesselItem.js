import { connect } from 'react-redux';
import RecentVesselItem from 'recentVessels/components/RecentVesselItem';
import { addVessel, clearVesselInfo } from 'vesselInfo/vesselInfoActions';
import { toggleLayerVisibility } from 'layers/layersActions';
import { setRecentVesselsModalVisibility } from 'recentVessels/recentVesselsActions';
import { trackRecentVesselAdded } from 'analytics/analyticsActions';

const mapDispatchToProps = dispatch => ({
  drawVessel: (vesselDetails) => {
    dispatch(trackRecentVesselAdded());
    dispatch(toggleLayerVisibility(vesselDetails.tilesetId, true));
    dispatch(clearVesselInfo());
    dispatch(addVessel({
      tilesetId: vesselDetails.tilesetId,
      seriesgroup: vesselDetails.seriesgroup,
      fromSearch: true
    }));
  },
  closeRecentVesselModal: () => {
    dispatch(setRecentVesselsModalVisibility(false));
  }
});

export default connect(null, mapDispatchToProps)(RecentVesselItem);
