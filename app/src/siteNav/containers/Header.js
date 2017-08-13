import { connect } from 'react-redux';
import Header from 'siteNav/components/Header';
import { login, logout } from 'user/userActions';
import { setShareModalError, openShareModal } from 'share/shareActions';
import { saveWorkspace, getWorkspace } from 'actions/workspace';

const mapStateToProps = state => ({
  loggedUser: state.user.loggedUser,
  urlWorkspaceId: state.map.urlWorkspaceId
});

const mapDispatchToProps = dispatch => ({
  login: () => {
    dispatch(login());
  },
  logout: () => {
    const queryParams = location.query;
    const workspace = queryParams ? queryParams.workspace : null;
    dispatch(logout());
    dispatch(getWorkspace(workspace));
  },
  openShareModal: () => {
    dispatch(openShareModal(true));
    dispatch(saveWorkspace(setShareModalError));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
