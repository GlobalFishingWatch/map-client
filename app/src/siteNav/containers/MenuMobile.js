import { connect } from 'react-redux';
import MenuMobile from 'siteNav/components/MenuMobile';
import { login, logout } from 'user/userActions';
import { getWorkspace } from 'workspace/workspaceActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  loggedUser: state.user.loggedUser
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
  setSupportModalVisibility: () => {
    dispatch(setSupportModalVisibility(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuMobile);
