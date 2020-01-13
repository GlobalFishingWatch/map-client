import { connect } from 'react-redux'
import LeftControlPanel from 'app/mapPanels/leftControlPanel/components/LeftControlPanel'
import { openShareModal, setShareModalError } from 'app/share/shareActions'
import { canShareWorkspaces } from 'app/user/userSelectors'
import { saveWorkspace, incrementZoom, decrementZoom } from 'app/workspace/workspaceActions'
import { setSupportModalVisibility } from 'app/siteNav/supportFormActions'

const mapStateToProps = (state) => ({
  isEmbedded: state.app.isEmbedded,
  canZoomIn: state.workspace.viewport.canZoomIn,
  canZoomOut: state.workspace.viewport.canZoomOut,
  mouseLatLon: state.workspace.mouseLatLon,
  canShareWorkspaces: canShareWorkspaces(state),
})

const mapDispatchToProps = (dispatch) => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true))
  },
  openShareModal: () => {
    dispatch(openShareModal(true))
    dispatch(saveWorkspace(setShareModalError))
  },
  incrementZoom: () => {
    dispatch(incrementZoom())
  },
  decrementZoom: () => {
    dispatch(decrementZoom())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftControlPanel)
