import { connect } from 'react-redux';
import App from 'components/App';
import { setToken, getLoggedUser } from 'actions/user';
import { setWelcomeModalUrl, setWelcomeModalContent } from 'actions/modal';

const mapStateToProps = state => ({
  welcomeModalUrl: state.modal.welcome.url
});

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(setToken(token)),
  getLoggedUser: () => dispatch(getLoggedUser()),
  setWelcomeModalUrl: () => dispatch(setWelcomeModalUrl()),
  setWelcomeModalContent: () => dispatch(setWelcomeModalContent())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
