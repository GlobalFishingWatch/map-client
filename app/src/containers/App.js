import { connect } from 'react-redux';
import App from 'components/App';
import { setToken, getLoggedUser } from 'actions/user';
import { setWelcomeModalUrl, setWelcomeModalContent } from 'actions/modal';
import { loadLiterals } from 'siteNav/literalsActions';

const mapStateToProps = state => ({
  welcomeModalUrl: state.modal.welcome.url,
  banner: state.literals.banner
});

const mapDispatchToProps = dispatch => ({
  loadLiterals: () => dispatch(loadLiterals()),
  setToken: token => dispatch(setToken(token)),
  getLoggedUser: () => dispatch(getLoggedUser()),
  setWelcomeModalUrl: () => dispatch(setWelcomeModalUrl()),
  setWelcomeModalContent: () => dispatch(setWelcomeModalContent())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
