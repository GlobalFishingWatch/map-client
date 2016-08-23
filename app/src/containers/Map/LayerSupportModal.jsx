import { connect } from 'react-redux';
import LayerSupportModal from '../../components/Map/LayerSupportModal';
import { setVisibleSupportModal } from '../../actions/appearence';

const mapDispatchToProps = (dispatch) => ({
  setVisibleSupportModal: (visible) => {
    dispatch(setVisibleSupportModal(visible));
  }
});

export default connect(null, mapDispatchToProps)(LayerSupportModal);
