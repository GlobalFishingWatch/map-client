import { connect } from 'react-redux'
import Header from 'app/siteNav/components/Header'
import { login, logout } from 'app/user/userActions'
import { setShareModalError, openShareModal } from 'app/share/shareActions'
import { saveWorkspace, getWorkspace } from 'app/workspace/workspaceActions'

const mapStateToProps = (state) => ({
  loggedUser: state.user.loggedUser,
  urlWorkspaceId: state.workspace.urlWorkspaceId,
  isEmbedded: state.app.isEmbedded,
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
  openShareModal: () => {
    dispatch(openShareModal(true))
    dispatch(saveWorkspace(setShareModalError))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
