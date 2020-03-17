import { connect } from 'react-redux'
import Header from 'app/siteNav/components/Header'
import { login } from 'app/user/userActions'
import { setShareModalError, openShareModal } from 'app/share/shareActions'
import { saveWorkspace } from 'app/workspace/workspaceActions'
import { canShareWorkspaces } from 'app/user/userSelectors'

const mapStateToProps = (state) => ({
  loggedUser: state.user.loggedUser,
  urlWorkspaceId: state.workspace.urlWorkspaceId,
  isEmbedded: state.app.isEmbedded,
  canShareWorkspaces: canShareWorkspaces(state),
})

const mapDispatchToProps = (dispatch) => ({
  login: () => {
    dispatch(login())
  },
  openShareModal: () => {
    dispatch(openShareModal(true))
    dispatch(saveWorkspace(setShareModalError))
  },
  setSupportModalVisibility: () => {},
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
