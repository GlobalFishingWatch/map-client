import { connect } from 'react-redux';
import App from 'components/App';
import { checkInitialNotification } from 'src/notifications/notificationsActions';
import { setToken, getLoggedUser } from 'user/userActions';
import { setWelcomeModalUrl, setWelcomeModalContent } from 'welcomeModal/welcomeModalActions';

const mapStateToProps = state => ({
  welcomeModalUrl: state.welcomeModal.url
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
  checkInitialNotification: () => dispatch(checkInitialNotification()),
  getLoggedUser: () => dispatch(getLoggedUser()),
  setWelcomeModalUrl: () => dispatch(setWelcomeModalUrl()),
  setWelcomeModalContent: () => dispatch(setWelcomeModalContent())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
