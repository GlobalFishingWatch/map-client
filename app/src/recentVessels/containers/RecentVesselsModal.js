import { connect } from 'react-redux';
import RecentVesselsModal from 'recentVessels/components/RecentVesselsModal';
import { addVessel, clearVesselInfo } from 'actions/vesselInfo';
import { setRecentVesselsModalVisibility } from 'recentVessels/recentVesselsActions';
import { toggleLayerVisibility } from 'layers/layersActions';

const mapStateToProps = state => ({
  history: state.recentVessels.history,
  vessels: state.vesselInfo.vessels
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setRecentVesselsModalVisibility(false));
  },
  drawVessel: (tilesetId, seriesgroup, series) => {
    dispatch(toggleLayerVisibility(tilesetId, true));
    dispatch(clearVesselInfo());
    dispatch(addVessel(tilesetId, seriesgroup, series, true));
    dispatch(setRecentVesselsModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentVesselsModal);
