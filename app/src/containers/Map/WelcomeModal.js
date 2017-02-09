import { connect } from 'react-redux';
import WelcomeModal from 'components/Map/WelcomeModal';
import { setWelcomeModalVisibility } from 'actions/modal';

const mapStateToProps = state => ({
  content: state.modal.welcome.content
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setWelcomeModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal);
