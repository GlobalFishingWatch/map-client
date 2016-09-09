import { connect } from 'react-redux';
import MenuMobile from '../components/Shared/MenuMobile';
import { login, logout } from '../actions/user';
import { getWorkspace } from '../actions/map';

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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuMobile);
