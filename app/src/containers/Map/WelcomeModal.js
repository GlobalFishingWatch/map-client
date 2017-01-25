import { connect } from 'react-redux';
import WelcomeModal from 'components/Map/WelcomeModal';
import { setWelcomeModalVisibility } from 'actions/map';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(setWelcomeModalVisibility(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal);
