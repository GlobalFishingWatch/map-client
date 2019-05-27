import { connect } from 'react-redux'
import MenuMobile from 'app/siteNav/components/MenuMobile'
import { login, logout } from 'app/user/userActions'
import { getWorkspace } from 'app/workspace/workspaceActions'
import { setSupportModalVisibility } from 'app/siteNav/supportFormActions'

const mapStateToProps = (state) => ({
  loggedUser: state.user.loggedUser,
})

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login())
  },
  logout: () => {
    const queryParams = window.location.query
    const workspace = queryParams ? queryParams.workspace : null
    dispatch(logout())
    dispatch(getWorkspace(workspace))
  },
  setSupportModalVisibility: () => {
    dispatch(setSupportModalVisibility(true))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuMobile)
