import { connect } from 'react-redux';
import Header from 'components/Shared/Header';
import { login, logout } from 'actions/user';
import { saveWorkspace, getWorkspace, setShareModalError, openShareModal } from 'actions/map';

const mapStateToProps = (state) => ({
  loggedUser: state.user.loggedUser
});

const mapDispatchToProps = (dispatch) => ({
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
