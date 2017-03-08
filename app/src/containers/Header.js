import { connect } from 'react-redux';
import Header from 'components/Shared/Header';
import { login, logout } from 'actions/user';
import { setShareModalError, openShareModal } from 'actions/map';
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
