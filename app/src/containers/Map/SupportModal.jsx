import { connect } from 'react-redux';
import SupportModal from '../../components/Map/SupportModal';
import { setVisibleSupportModal } from '../../actions/appearence';

const mapDispatchToProps = (dispatch) => ({
  setVisibleSupportModal: (visible) => {
    dispatch(setVisibleSupportModal(visible));
  }
});

export default connect(null, mapDispatchToProps)(SupportModal);
