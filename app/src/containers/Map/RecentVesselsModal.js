import { connect } from 'react-redux';
import RecentVesselsModal from 'components/Map/RecentVesselsModal';
import { setRecentVesselsModalVisibility } from 'actions/vesselInfo';

const mapStateToProps = state => ({
  vessels: state.vesselInfo.details
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setRecentVesselsModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentVesselsModal);
