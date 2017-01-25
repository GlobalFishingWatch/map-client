import { connect } from 'react-redux';
import RecentVesselsModal from 'components/Map/RecentVesselsModal';
import { addVessel, clearVesselInfo } from 'actions/vesselInfo';
import { setRecentVesselsModalVisibility } from 'actions/map';

const mapStateToProps = state => ({
  history: state.vesselInfo.history
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setRecentVesselsModalVisibility(false));
  },

  drawVessel: (seriesgroup, series) => {
    dispatch(clearVesselInfo());
    dispatch(addVessel(seriesgroup, series, true));
    dispatch(setRecentVesselsModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentVesselsModal);
