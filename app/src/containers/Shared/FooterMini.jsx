import { connect } from 'react-redux';
import FooterMini from '../../components/Shared/FooterMini';
import { setVisibleSupportModal } from '../../actions/appearence';

const mapStateToProps = (state) => ({
  supportModalVisible: state.appearance.supportModalVisible
});

const mapDispatchToProps = (dispatch) => ({
  setVisibleSupportModal: (visible) => {
    dispatch(setVisibleSupportModal(visible));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FooterMini);
