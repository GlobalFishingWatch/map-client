import { connect } from 'react-redux';

import MenuMobile from 'components/Shared/MenuMobile';
import { login, logout } from 'actions/user';
import { setSupportModalVisibility } from 'actions/map';
import { getWorkspace } from 'actions/workspace';
import { trackOutsideLinkClicked } from 'actions/analytics';

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
  },
  beforeLeave: (link) => {
    dispatch(trackOutsideLinkClicked(link));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuMobile);
