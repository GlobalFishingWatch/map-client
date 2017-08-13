import { connect } from 'react-redux';
import WelcomeModal from 'welcomeModal/components/WelcomeModal';
import { setWelcomeModalVisibility } from 'welcomeModal/welcomeModalActions';

const mapStateToProps = state => ({
  content: state.welcomeModal.content
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setWelcomeModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal);
