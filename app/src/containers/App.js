import { connect } from 'react-redux';
import App from 'components/App';
import { setToken, getLoggedUser } from 'user/userActions';
import { setWelcomeModalUrl, setWelcomeModalContent } from 'welcomeModal/welcomeModalActions';
import { loadLiterals } from 'siteNav/literalsActions';

const mapStateToProps = state => ({
  welcomeModalUrl: state.welcomeModal.url,
  banner: state.literals.banner,
  bannerLegacyWorkspace: state.literals.legacy_workspace_warning,
  bannerWebGL: state.literals.webgl_warning,
  bannerEdge: state.literals.edge_warning,
  legacyWorkspaceLoaded: state.workspace.legacyWorkspaceLoaded,
  hasDeprecatedActivityLayersMessage: state.layers.hasDeprecatedActivityLayersMessage
});

const mapDispatchToProps = dispatch => ({
  loadLiterals: () => dispatch(loadLiterals()),
  setToken: token => dispatch(setToken(token)),
  getLoggedUser: () => dispatch(getLoggedUser()),
  setWelcomeModalUrl: () => dispatch(setWelcomeModalUrl()),
  setWelcomeModalContent: () => dispatch(setWelcomeModalContent())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
